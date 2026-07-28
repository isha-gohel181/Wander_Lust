// server/src/services/ragService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Property = require("../models/Property");
const KnowledgeChunk = require("../models/KnowledgeChunk");

// ---------------------------------------------------------------------------
// Live-data resolver – answers factual/aggregate questions from the real DB
// ---------------------------------------------------------------------------
const AGGREGATE_PATTERNS = [
  /how many (properties|listings|homes|places|stays)/i,
  /total (number of )?(properties|listings)/i,
  /number of (properties|listings)/i,
  /count (of )?(properties|listings)/i,
  /properties (are |currently )?(listed|available|on the platform)/i,
];

const isAggregateQuery = (query) =>
  AGGREGATE_PATTERNS.some((pattern) => pattern.test(query));

const resolveLiveData = async (query) => {
  const normalizedQuery = (query || "").toLowerCase();

  if (isAggregateQuery(normalizedQuery)) {
    const totalProperties = await Property.countDocuments({ isActive: true });
    const cityAgg = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$location.city" } },
      { $sort: { _id: 1 } },
    ]);
    const cities = cityAgg.map((c) => c._id).filter(Boolean);
    return {
      type: "aggregate",
      totalProperties,
      cities,
      summary: `There are currently ${totalProperties} active propert${
        totalProperties === 1 ? "y" : "ies"
      } listed on Wanderlust${
        cities.length > 0 ? `, spanning ${cities.length} cit${
          cities.length === 1 ? "y" : "ies"
        }: ${cities.join(", ")}` : ""
      }.`,
    };
  }

  return null;
};

const STATIC_KNOWLEDGE = [
  {
    sourceId: "faq-booking-flow",
    title: "How booking works",
    content:
      "Guests can search listings by destination, price, property type, room type, bedrooms, bathrooms, and amenities. After selecting a property, they can review the details, choose dates, and proceed to booking and payment.",
    metadata: {
      topic: "booking",
      tags: ["search", "booking", "payment"],
    },
  },
  {
    sourceId: "faq-trust-quality",
    title: "How we keep stays trustworthy",
    content:
      "The platform highlights verified property details, ratings, amenities, and house rules so guests can make confident decisions. The assistant should prioritize properties that match the user's budget, guest count, and preferences.",
    metadata: {
      topic: "trust",
      tags: ["quality", "ratings", "host"],
    },
  },
  {
    sourceId: "faq-filters",
    title: "Using filters to refine results",
    content:
      "Filters can narrow results by property type, room type, price range, bedrooms, bathrooms, and amenities. The assistant should suggest concise filter combinations when a user wants a specific style of stay.",
    metadata: {
      topic: "filters",
      tags: ["search", "filters", "recommendation"],
    },
  },
  {
    sourceId: "faq-host-tools",
    title: "Host tools and listing management",
    content:
      "Hosts can create, update, and manage listings from the dashboard, upload images, and track bookings. The assistant should mention host tools when the user asks about publishing or managing properties.",
    metadata: {
      topic: "hosting",
      tags: ["host", "dashboard", "listing"],
    },
  },
];

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenerativeAI(apiKey);
};

// Primary model is gemini-3.6-flash with gemini-2.5-pro as fallback
const getChatModelNames = () => {
  const envModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  return [...new Set([envModel, "gemini-2.5-pro"])].filter(Boolean);
};

const normalizeText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim();

const formatCurrency = (amount, currency = "INR") => {
  if (amount === null || amount === undefined) return "N/A";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount}`;
  }
};

const buildPropertyKnowledgeText = (property) => {
  const amenities = Array.isArray(property.amenities)
    ? property.amenities.join(", ")
    : "No listed amenities";

  const rules = property.houseRules || {};
  const hostName = property.host
    ? [property.host.firstName, property.host.lastName].filter(Boolean).join(" ")
    : "Host not listed";

  return normalizeText(
    [
      `Title: ${property.title}`,
      `Location: ${property.location?.address}, ${property.location?.city}, ${property.location?.state}, ${property.location?.country}`,
      `Property type: ${property.propertyType}`,
      `Room type: ${property.roomType}`,
      `Guests: accommodates ${property.accommodates}, bedrooms ${property.bedrooms}, bathrooms ${property.bathrooms}, beds ${property.beds}`,
      `Price: ${formatCurrency(property.pricing?.basePrice, property.pricing?.currency)} per night`,
      `Amenities: ${amenities}`,
      `Ratings: overall ${property.ratings?.overall || 0}/5, cleanliness ${property.ratings?.cleanliness || 0}/5, location ${property.ratings?.location || 0}/5`,
      `Rules: check-in ${rules.checkInTime || "15:00"}, check-out ${rules.checkOutTime || "11:00"}, smoking ${rules.smokingAllowed ? "allowed" : "not allowed"}, pets ${rules.petsAllowed ? "allowed" : "not allowed"}, parties ${rules.partiesAllowed ? "allowed" : "not allowed"}`,
      `Host: ${hostName}`,
      `Description: ${property.description}`,
    ].join(". ")
  );
};

const buildStaticKnowledgeText = (entry) =>
  normalizeText(`${entry.title}. ${entry.content}`);

const cosineSimilarity = (vectorA = [], vectorB = []) => {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) return 0;
  if (vectorA.length === 0 || vectorB.length === 0) return 0;

  const length = Math.min(vectorA.length, vectorB.length);
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < length; index += 1) {
    const valueA = vectorA[index] || 0;
    const valueB = vectorB[index] || 0;
    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

const LOCAL_EMBEDDING_DIMENSIONS = 128;

const hashToken = (token) => {
  let hash = 0;

  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const buildLocalEmbedding = (text) => {
  const normalized = normalizeText(text).toLowerCase();
  const tokens = normalized.match(/[a-z0-9]+/g) || [];
  const vector = new Array(LOCAL_EMBEDDING_DIMENSIONS).fill(0);

  if (tokens.length === 0) {
    return vector;
  }

  for (const token of tokens) {
    const index = hashToken(token) % LOCAL_EMBEDDING_DIMENSIONS;
    vector[index] += 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
};

const getEmbedding = async (text) => {
  return buildLocalEmbedding(text);
};

const upsertKnowledgeChunk = async ({
  sourceType,
  sourceId,
  title,
  content,
  metadata = {},
  sourceUpdatedAt = null,
}) => {
  const embedding = await getEmbedding(content);

  await KnowledgeChunk.updateOne(
    { sourceType, sourceId },
    {
      $set: {
        sourceType,
        sourceId,
        title,
        content,
        embedding,
        metadata,
        sourceUpdatedAt,
      },
    },
    { upsert: true }
  );
};

const syncStaticKnowledge = async () => {
  const existingFaqChunks = await KnowledgeChunk.find({ sourceType: "faq" })
    .select("sourceId")
    .lean();

  const existingFaqIds = new Set(
    existingFaqChunks.map((chunk) => String(chunk.sourceId))
  );

  for (const entry of STATIC_KNOWLEDGE) {
    if (existingFaqIds.has(entry.sourceId)) {
      continue;
    }

    await upsertKnowledgeChunk({
      sourceType: "faq",
      sourceId: entry.sourceId,
      title: entry.title,
      content: buildStaticKnowledgeText(entry),
      metadata: entry.metadata,
      sourceUpdatedAt: new Date(),
    });
  }
};

const syncPropertyKnowledge = async () => {
  const properties = await Property.find({ isActive: true }).populate(
    "host",
    "firstName lastName avatar"
  );

  const existingChunks = await KnowledgeChunk.find({ sourceType: "property" })
    .select("sourceId sourceUpdatedAt")
    .lean();

  const existingMap = new Map(
    existingChunks.map((chunk) => [String(chunk.sourceId), chunk])
  );
  const activeIds = new Set(properties.map((property) => String(property._id)));

  for (const property of properties) {
    const sourceId = String(property._id);
    const existingChunk = existingMap.get(sourceId);
    const needsRefresh =
      !existingChunk ||
      !existingChunk.sourceUpdatedAt ||
      !property.updatedAt ||
      new Date(existingChunk.sourceUpdatedAt).getTime() <
        new Date(property.updatedAt).getTime();

    if (needsRefresh) {
      await upsertKnowledgeChunk({
        sourceType: "property",
        sourceId,
        title: property.title,
        content: buildPropertyKnowledgeText(property),
        metadata: {
          propertyId: sourceId,
          title: property.title,
          city: property.location?.city,
          state: property.location?.state,
          country: property.location?.country,
          propertyType: property.propertyType,
          roomType: property.roomType,
          basePrice: property.pricing?.basePrice,
          currency: property.pricing?.currency || "INR",
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          accommodates: property.accommodates,
          rating: property.ratings?.overall || 0,
          amenities: property.amenities || [],
          slug: sourceId,
        },
        sourceUpdatedAt: property.updatedAt || new Date(),
      });
    }
  }

  const staleChunks = existingChunks.filter(
    (chunk) => !activeIds.has(String(chunk.sourceId))
  );

  if (staleChunks.length > 0) {
    await KnowledgeChunk.deleteMany({
      sourceType: "property",
      sourceId: { $in: staleChunks.map((chunk) => String(chunk.sourceId)) },
    });
  }
};

const ensureKnowledgeBase = async () => {
  await syncStaticKnowledge();
  await syncPropertyKnowledge();
};

const retrieveRelevantChunks = async (query, limit = 5) => {
  const queryEmbedding = await getEmbedding(query);
  const chunks = await KnowledgeChunk.find({})
    .select("sourceType sourceId title content metadata embedding sourceUpdatedAt")
    .lean();

  const ranked = chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  return ranked;
};

const buildContextBlock = (chunks) =>
  chunks
    .map((chunk, index) => {
      const metadata = chunk.metadata || {};
      const locationParts = [metadata.city, metadata.state, metadata.country].filter(Boolean);
      const location = locationParts.join(", ");
      const price = metadata.basePrice
        ? `${formatCurrency(metadata.basePrice, metadata.currency)} per night`
        : "Price not listed";

      return [
        `Source ${index + 1}: ${chunk.title}`,
        `Type: ${chunk.sourceType}`,
        location ? `Location: ${location}` : null,
        metadata.propertyType ? `Property type: ${metadata.propertyType}` : null,
        metadata.roomType ? `Room type: ${metadata.roomType}` : null,
        price ? `Price: ${price}` : null,
        metadata.rating !== undefined ? `Rating: ${metadata.rating}/5` : null,
        `Details: ${chunk.content}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

const generateAnswer = async (question, chunks, liveData = null) => {
  const genAI = getGeminiClient();
  const context = buildContextBlock(chunks);

  // Build a live-data section so Gemini has accurate facts for aggregate queries
  const liveDataSection = liveData
    ? `\nLive platform data (authoritative – use this for counts/totals):\n${liveData.summary}\n`
    : "";

  const prompt = `You are the Wanderlust travel assistant.
You have access to real-time platform statistics and property context below.
Always use the Live platform data section (if present) for any questions about counts, totals, or how many properties exist.
For property recommendations, use the Context section.
If the context is missing details, say so clearly and suggest a helpful next step.
Be concise, friendly, and practical.

FORMATTING RULES (always follow these):
- Use **bold** for property names, locations, and prices.
- When listing multiple properties, use a numbered list (1. 2. 3.).
- Use bullet points (-) for features, amenities, or options within a property.
- Put each property's details on separate lines for readability.
- End with a brief helpful follow-up note.
${liveDataSection}
Question:
${normalizeText(question)}

Context:
${context || "No matching context was found."}

Answer using markdown formatting.`;

  let lastError = null;
  const modelNames = getChatModelNames();

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const answer = result.response.text();
      return { answer, modelName };
    } catch (error) {
      console.error(`Model ${modelName} failed:`, error?.message || error);
      lastError = error;
    }
  }

  // If Gemini is unavailable but we have live data, return a direct factual answer
  if (liveData?.type === "aggregate") {
    console.error("Gemini unavailable – returning live data answer directly");
    return {
      answer: liveData.summary,
      modelName: "live-data-fallback",
    };
  }

  const fallbackAnswer = chunks.length
    ? `I found some relevant Wanderlust matches, but Gemini could not generate a full response right now. Here are the best options I found: ${chunks
        .slice(0, 3)
        .map((chunk) => `${chunk.title}${chunk.metadata?.city ? ` in ${chunk.metadata.city}` : ""}`)
        .join("; ")}.`
    : "I could not find a strong match right now. Try adding a destination, budget, or property type.";

  console.error("Gemini generation fallback used:", lastError?.message || lastError);
  return { answer: fallbackAnswer, modelName: "fallback" };
};

module.exports = {
  ensureKnowledgeBase,
  retrieveRelevantChunks,
  generateAnswer,
  resolveLiveData,
  syncPropertyKnowledge,
  syncStaticKnowledge,
};

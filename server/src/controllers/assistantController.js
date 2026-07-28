// server/src/controllers/assistantController.js
const {
  ensureKnowledgeBase,
  retrieveRelevantChunks,
  generateAnswer,
  resolveLiveData,
} = require("../services/ragService");

const chatWithAssistant = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    try {
      await ensureKnowledgeBase();
    } catch (syncError) {
      console.error("Knowledge base sync warning:", syncError);
    }

    // Resolve live DB facts (e.g. property count) for aggregate questions
    let liveData = null;
    try {
      liveData = await resolveLiveData(query);
    } catch (liveErr) {
      console.error("Live data resolution warning:", liveErr);
    }

    const sources = await retrieveRelevantChunks(query, 5);
    const { answer, modelName } = await generateAnswer(query, sources, liveData);

    res.json({
      success: true,
      query,
      answer,
      model: modelName,
      sources: sources.map((chunk) => ({
        id: chunk.sourceId,
        sourceType: chunk.sourceType,
        title: chunk.title,
        similarity: Number(chunk.score.toFixed(4)),
        metadata: chunk.metadata,
        content: chunk.content,
      })),
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate assistant response",
    });
  }
};

module.exports = {
  chatWithAssistant,
};

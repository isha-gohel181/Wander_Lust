# Wander AI Assistant - Architecture & Implementation Plan

This document details the architecture, data flow, RAG (Retrieval-Augmented Generation) pipeline, frontend widget integration, and backend execution plan for the **Wander AI Assistant**.

---

## 1. System Architecture Overview

The Wander AI Assistant is built as a hybrid Retrieval-Augmented Generation (RAG) system combining MongoDB-backed property listings, static platform FAQs, and Google Generative AI (`gemini-3.6-flash` / `gemini-2.5-pro`) to provide context-aware, highly accurate recommendations and customer support.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React 19)                             │
├───────────────────────────────┬────────────────────────────────────────┤
│ Floating Widget (Bottom-Right)│ Full Assistant Page (/assistant)       │
│ - Collapsible / Resizable     │ - Immersive Chat Interface             │
│ - State Persistence           │ - Markdown Formatting                  │
│ - Quick Suggestion Chips      │ - Rich Source Attribution              │
└──────────────┬────────────────┴───────────────────┬────────────────────┘
               │                                    │
               └──────────────────┬─────────────────+
                                  │ POST /api/assistant/chat
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Express.js)                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Rate Limiter (Express Rate Limit - 20 req/min)                      │
│ 2. Live Data Resolver (Aggregate counts, city indices from MongoDB)   │
│ 3. Knowledge Base Sync (Indexes properties & FAQs into KnowledgeChunks)│
│ 4. Semantic Retriever (Cosine similarity search over embeddings)      │
│ 5. LLM Generator (Google Generative AI with fallback model chain)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Data Flow & Execution Pipeline

### Step 1: User Interaction (Frontend)
- The user interacts with either the **Floating AI Chat Widget** (accessible globally via `Layout.jsx`) or the dedicated **Full Assistant Page** (`/assistant`).
- When a user sends a query (or clicks a suggestion chip like *"Find Properties"* or *"Booking Help"*):
  1. The UI instantly appends the user message to the chat history.
  2. A loading animation state (`Wander AI is thinking...`) is activated.
  3. The request is dispatched via Axios (`assistantService.ask(query)`) to the backend endpoint: `POST /api/assistant/chat`.

### Step 2: Rate Limiting & Validation (Backend Route)
- **Rate Limiting:** `express-rate-limit` enforces a strict threshold (maximum 20 requests per minute per IP) to prevent abuse or runaway token generation.
- **Validation:** Ensures `query` is present and non-empty.

### Step 3: Knowledge Base Synchronization & Live Data Resolution
- **Knowledge Base Sync (`ensureKnowledgeBase`):** Checks and synchronizes active MongoDB property documents and static FAQ entries into the `KnowledgeChunk` collection, generating searchable vector embeddings.
- **Live Data Resolver (`resolveLiveData`):** Evaluates if the user query is an aggregate or factual question (e.g., *"How many properties are listed?"*, *"Total listings"*). If matched, it queries MongoDB directly for exact counts and city distributions (`Property.countDocuments` and aggregation pipelines) to inject verified statistics directly into the prompt.

### Step 4: Semantic Retrieval (RAG Pipeline)
- **Vector Embeddings & Cosine Similarity (`retrieveRelevantChunks`):** 
  - Converts the user query into a vector representation.
  - Computes cosine similarity against indexed knowledge chunks (properties and FAQs).
  - Retrieves top $K$ (e.g., $K=5$) most relevant knowledge chunks containing property specifications, pricing, amenities, house rules, and FAQs.

### Step 5: LLM Prompt Generation & Response (`generateAnswer`)
- **Model Chain:** Initializes Google Generative AI (`GoogleGenerativeAI`) using `GEMINI_API_KEY`.
- **Primary Model:** `gemini-3.6-flash` (with `gemini-2.5-pro` as an automatic fallback).
- **Prompt Construction:** Combines system instructions, retrieved live database statistics, top relevant property/FAQ chunks, and user history into a structured prompt.
- **Response Formatting:** Returns a JSON response containing:
  - `success`: boolean
  - `query`: original query string
  - `answer`: markdown-formatted response string
  - `model`: model name utilized
  - `sources`: array of attributed source objects (property IDs, titles, similarity scores, metadata)

### Step 6: UI Rendering (Frontend)
- The client receives the response JSON.
- The lightweight markdown renderer formats the AI response inline (supporting bold, italics, lists, code blocks, and headings).
- Chat history is maintained in React state (`useState`), ensuring seamless persistence while minimizing or reopening the widget.

---

## 3. Component Architecture & Reusability

1. **`FloatingAssistantWidget.jsx`**:
   - Location: `client/src/components/assistant/FloatingAssistantWidget.jsx`
   - Role: Bottom-right fixed floating chat widget.
   - Features: Trigger pulse icon, header with online indicator, minimize/restore, close, direct link to full page (`/assistant`), markdown parser, quick suggestion chips, auto-scrolling message list.

2. **`Assistant.jsx`**:
   - Location: `client/src/pages/Assistant.jsx`
   - Role: Dedicated full-screen assistant page for immersive planning and exploration.

3. **`assistantService.js`**:
   - Location: `client/src/services/assistant.js`
   - Role: Axios API client wrapper for communicating with `/api/assistant/chat`.

4. **`ragService.js`**:
   - Location: `server/src/services/ragService.js`
   - Role: Core RAG engine handling embedding vector calculations, cosine similarity retrieval, MongoDB aggregation, and Gemini AI interaction.

---

## 4. Production Readiness & Security Best Practices
- **Secure API Key Handling**: `GEMINI_API_KEY` is kept strictly server-side in environment variables (`server/.env`).
- **Error Resilience**: Graceful fallbacks for network errors, model limits, and missing API keys.
- **Responsive & Accessible**: Fully optimized for mobile and desktop viewports with ARIA attributes and smooth animations.

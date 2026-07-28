// server/src/models/KnowledgeChunk.js
const mongoose = require("mongoose");

const knowledgeChunkSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      required: true,
      enum: ["property", "faq", "policy", "guide"],
    },
    sourceId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sourceUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

knowledgeChunkSchema.index({ sourceType: 1, sourceId: 1 }, { unique: true });
knowledgeChunkSchema.index({ sourceType: 1 });

module.exports = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

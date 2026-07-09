const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencySession',
      required: true,
      index: true,
    },
    kind: {
      type: String,
      enum: ['audio', 'photo', 'video', 'text', 'screenshot'],
      required: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    storagePath: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    transcript: {
      type: String,
      default: '',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Evidence', evidenceSchema);

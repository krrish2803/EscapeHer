const mongoose = require('mongoose');

const heartbeatSchema = new mongoose.Schema(
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
      enum: ['checkin', 'missed'],
      required: true,
      index: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['on_time', 'late', 'missed'],
      default: 'on_time',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

heartbeatSchema.index({ session: 1, sequence: -1 });
heartbeatSchema.index({ session: 1, receivedAt: -1 });

module.exports = mongoose.model('Heartbeat', heartbeatSchema);

const mongoose = require('mongoose');

const emergencySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    triggerType: {
      type: String,
      enum: ['manual_sos', 'heartbeat_escalation', 'voice_trigger', 'auto_detect'],
      default: 'manual_sos',
    },
    status: {
      type: String,
      enum: ['active', 'escalated', 'resolved', 'cancelled'],
      default: 'active',
      index: true,
    },
    heartbeatIntervalSeconds: {
      type: Number,
      default: 300,
    },
    missedHeartbeatCount: {
      type: Number,
      default: 0,
    },
    escalationLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    lastKnownLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

emergencySessionSchema.index({ user: 1, status: 1 });
emergencySessionSchema.index({ user: 1, startedAt: -1 });

module.exports = mongoose.model('EmergencySession', emergencySessionSchema);

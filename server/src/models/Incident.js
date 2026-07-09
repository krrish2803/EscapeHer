const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: [
        'EMERGENCY_STARTED',
        'HEARTBEAT_RECEIVED',
        'HEARTBEAT_MISSED',
        'ESCALATION_TRIGGERED',
        'SESSION_RESOLVED',
        'SESSION_CANCELLED',
        'LOCATION_UPDATED',
        'CONTACT_NOTIFIED',
        'EVIDENCE_UPLOADED',
        'REPORT_GENERATED',
        'AI_ANALYSIS_COMPLETED',
        'STATUS_CHANGED',
      ],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

incidentSchema.index({ session: 1, timestamp: 1 });
incidentSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('Incident', incidentSchema);

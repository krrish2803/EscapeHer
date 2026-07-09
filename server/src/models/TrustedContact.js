const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    relation: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    notifyBy: {
      type: [String],
      enum: ['sms', 'push', 'email'],
      default: ['sms'],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

trustedContactSchema.index({ user: 1, priority: -1 });

module.exports = mongoose.model('TrustedContact', trustedContactSchema);

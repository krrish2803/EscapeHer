const User = require('../models/User');
const EmergencySession = require('../models/EmergencySession');
const TrustedContact = require('../models/TrustedContact');
const Incident = require('../models/Incident');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler, sanitizeUser } = require('../utils/helpers');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }
  return successResponse(res, user.toSafeObject(), 'Profile fetched');
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'avatarUrl', 'emergencyPreferences'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  return successResponse(res, user.toSafeObject(), 'Profile updated');
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [activeSession, contactCount, recentIncidentsCount] = await Promise.all([
    EmergencySession.findOne({ user: userId, status: { $in: ['active', 'escalated'] } }).lean(),
    TrustedContact.countDocuments({ user: userId }),
    Incident.countDocuments({ user: userId, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
  ]);

  const summary = {
    activeEmergency: activeSession
      ? {
          id: activeSession._id,
          status: activeSession.status,
          triggerType: activeSession.triggerType,
          startedAt: activeSession.startedAt,
          escalationLevel: activeSession.escalationLevel,
        }
      : null,
    trustedContactsCount: contactCount,
    recentIncidentsCount,
  };

  return successResponse(res, summary, 'Dashboard summary');
});

module.exports = { getProfile, updateProfile, getDashboardSummary };

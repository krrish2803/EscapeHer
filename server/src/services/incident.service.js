const Incident = require('../models/Incident');

async function createIncidentEntry({ userId, sessionId, type, message, severity = 'info', metadata = {} }) {
  const incident = await Incident.create({
    user: userId,
    session: sessionId,
    type,
    message,
    severity,
    metadata,
  });
  return incident;
}

async function getIncidentTimeline(sessionId, userId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const [incidents, total] = await Promise.all([
    Incident.find({ session: sessionId, user: userId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Incident.countDocuments({ session: sessionId, user: userId }),
  ]);
  return { incidents, total, page, limit };
}

async function getIncidentById(incidentId, userId) {
  const incident = await Incident.findOne({ _id: incidentId, user: userId }).lean();
  if (!incident) {
    const err = new Error('Incident not found');
    err.statusCode = 404;
    throw err;
  }
  return incident;
}

async function getIncidentHistory(userId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const [incidents, total] = await Promise.all([
    Incident.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('session', 'status triggerType startedAt')
      .lean(),
    Incident.countDocuments({ user: userId }),
  ]);
  return { incidents, total, page, limit };
}

module.exports = {
  createIncidentEntry,
  getIncidentTimeline,
  getIncidentById,
  getIncidentHistory,
};

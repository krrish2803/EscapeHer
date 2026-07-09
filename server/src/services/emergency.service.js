const EmergencySession = require('../models/EmergencySession');
const Incident = require('../models/Incident');
const notificationService = require('./notification.service');
const socketService = require('./socket.service');

async function createEmergencySession(userId, { triggerType = 'manual_sos', notes = '' } = {}) {
  const activeSession = await EmergencySession.findOne({
    user: userId,
    status: { $in: ['active', 'escalated'] },
  });
  if (activeSession) {
    const err = new Error('You already have an active emergency session');
    err.statusCode = 409;
    throw err;
  }

  const session = await EmergencySession.create({
    user: userId,
    triggerType,
    notes,
  });

  await Incident.create({
    user: userId,
    session: session._id,
    type: 'EMERGENCY_STARTED',
    message: `Emergency session started via ${triggerType}`,
    severity: 'critical',
    metadata: { triggerType },
  });

  await notificationService.notifyTrustedContacts(userId, {
    sessionId: session._id,
    message: 'Emergency alert! A user has initiated an SOS.',
  });

  socketService.emitEmergencyUpdate(session._id, {
    type: 'EMERGENCY_STARTED',
    sessionId: session._id,
    status: session.status,
  });

  return session;
}

async function stopEmergencySession(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.status === 'resolved' || session.status === 'cancelled') {
    const err = new Error('Session is already ended');
    err.statusCode = 400;
    throw err;
  }

  session.status = 'resolved';
  session.endedAt = new Date();
  await session.save();

  await Incident.create({
    user: userId,
    session: session._id,
    type: 'SESSION_RESOLVED',
    message: 'Emergency session resolved',
    severity: 'info',
    metadata: { endedAt: session.endedAt },
  });

  await notificationService.notifySessionResolved(userId, {
    sessionId: session._id,
    message: 'The emergency session has been resolved.',
  });

  socketService.emitEmergencyUpdate(session._id, {
    type: 'SESSION_RESOLVED',
    sessionId: session._id,
    status: session.status,
  });

  return session;
}

async function getEmergencySessionById(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }
  return session;
}

async function getEmergencyHistory(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [sessions, total] = await Promise.all([
    EmergencySession.find({ user: userId })
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    EmergencySession.countDocuments({ user: userId }),
  ]);
  return { sessions, total, page, limit };
}

async function updateEmergencyStatus(sessionId, userId, { status, notes = '' }) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const oldStatus = session.status;
  session.status = status;
  if (status === 'resolved' || status === 'cancelled') {
    session.endedAt = new Date();
  }
  await session.save();

  await Incident.create({
    user: userId,
    session: session._id,
    type: status === 'cancelled' ? 'SESSION_CANCELLED' : 'STATUS_CHANGED',
    message: `Session status changed from ${oldStatus} to ${status}${notes ? ': ' + notes : ''}`,
    severity: status === 'cancelled' ? 'warning' : 'info',
    metadata: { oldStatus, newStatus: status, notes },
  });

  socketService.emitEmergencyUpdate(session._id, {
    type: 'STATUS_CHANGED',
    sessionId: session._id,
    status: session.status,
    oldStatus,
  });

  return session;
}

module.exports = {
  createEmergencySession,
  stopEmergencySession,
  getEmergencySessionById,
  getEmergencyHistory,
  updateEmergencyStatus,
};

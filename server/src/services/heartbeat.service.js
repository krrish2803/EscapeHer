const EmergencySession = require('../models/EmergencySession');
const Heartbeat = require('../models/Heartbeat');
const Incident = require('../models/Incident');
const User = require('../models/User');
const notificationService = require('./notification.service');
const socketService = require('./socket.service');

const MISSED_THRESHOLD = 3;

async function recordHeartbeat(sessionId, userId, metadata = {}) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.status !== 'active') {
    const err = new Error('Session is not active');
    err.statusCode = 400;
    throw err;
  }

  const lastHeartbeat = await Heartbeat.findOne({ session: sessionId })
    .sort({ sequence: -1 })
    .select('sequence');

  const nextSequence = lastHeartbeat ? lastHeartbeat.sequence + 1 : 1;

  const heartbeat = await Heartbeat.create({
    user: userId,
    session: sessionId,
    kind: 'checkin',
    sequence: nextSequence,
    status: 'on_time',
    metadata,
  });

  if (session.missedHeartbeatCount > 0) {
    session.missedHeartbeatCount = 0;
    await session.save();
  }

  await Incident.create({
    user: userId,
    session: sessionId,
    type: 'HEARTBEAT_RECEIVED',
    message: `Heartbeat check-in received (sequence #${nextSequence})`,
    severity: 'info',
    metadata: { sequence: nextSequence, ...metadata },
  });

  socketService.emitHeartbeatUpdate(sessionId, {
    type: 'HEARTBEAT_RECEIVED',
    sessionId,
    sequence: nextSequence,
    status: 'on_time',
  });

  return heartbeat;
}

async function recordMissedHeartbeat(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.status !== 'active') {
    const err = new Error('Session is not active');
    err.statusCode = 400;
    throw err;
  }

  session.missedHeartbeatCount += 1;

  const heartbeat = await Heartbeat.create({
    user: userId,
    session: sessionId,
    kind: 'missed',
    sequence: session.missedHeartbeatCount,
    status: 'missed',
  });

  await Incident.create({
    user: userId,
    session: sessionId,
    type: 'HEARTBEAT_MISSED',
    message: `Heartbeat missed (${session.missedHeartbeatCount}/${MISSED_THRESHOLD})`,
    severity: 'warning',
    metadata: { missedCount: session.missedHeartbeatCount, threshold: MISSED_THRESHOLD },
  });

  socketService.emitHeartbeatUpdate(sessionId, {
    type: 'HEARTBEAT_MISSED',
    sessionId,
    missedCount: session.missedHeartbeatCount,
  });

  if (session.missedHeartbeatCount >= MISSED_THRESHOLD) {
    await evaluateEscalation(session, userId);
  }

  await session.save();
  return heartbeat;
}

async function evaluateEscalation(session, userId) {
  session.escalationLevel += 1;
  session.status = 'escalated';
  await session.save();

  const user = await User.findById(userId);
  const contactMethod = user?.emergencyPreferences?.autoNotifyContacts !== false
    ? 'contacts and escalation service'
    : 'escalation service only';

  await Incident.create({
    user: userId,
    session: session._id,
    type: 'ESCALATION_TRIGGERED',
    message: `Escalation level ${session.escalationLevel} triggered after ${session.missedHeartbeatCount} missed heartbeats`,
    severity: 'critical',
    metadata: {
      escalationLevel: session.escalationLevel,
      missedHeartbeatCount: session.missedHeartbeatCount,
    },
  });

  await notificationService.notifyEscalation(userId, {
    sessionId: session._id,
    escalationLevel: session.escalationLevel,
    message: 'Escalation triggered! User has missed multiple heartbeats.',
  });

  socketService.emitEmergencyUpdate(session._id, {
    type: 'ESCALATION_TRIGGERED',
    sessionId: session._id,
    escalationLevel: session.escalationLevel,
    status: session.status,
  });
}

async function getHeartbeatStatus(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const lastHeartbeat = await Heartbeat.findOne({ session: sessionId })
    .sort({ receivedAt: -1 })
    .lean();

  return {
    sessionId: session._id,
    status: session.status,
    missedHeartbeatCount: session.missedHeartbeatCount,
    escalationLevel: session.escalationLevel,
    threshold: MISSED_THRESHOLD,
    lastHeartbeat,
  };
}

module.exports = {
  recordHeartbeat,
  recordMissedHeartbeat,
  getHeartbeatStatus,
  evaluateEscalation,
};

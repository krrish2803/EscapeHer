const Evidence = require('../models/Evidence');
const EmergencySession = require('../models/EmergencySession');
const Incident = require('../models/Incident');
const LocationPing = require('../models/LocationPing');
const Heartbeat = require('../models/Heartbeat');

async function saveEvidenceAudio({ userId, sessionId, file }) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const evidence = await Evidence.create({
    user: userId,
    session: sessionId,
    kind: 'audio',
    fileUrl: file.originalname,
    storagePath: `audio/${userId}/${sessionId}/${Date.now()}_${file.originalname}`,
    mimeType: file.mimetype,
    size: file.size,
  });

  await Incident.create({
    user: userId,
    session: sessionId,
    type: 'EVIDENCE_UPLOADED',
    message: 'Audio evidence uploaded',
    severity: 'info',
    metadata: { evidenceId: evidence._id, kind: 'audio', size: file.size },
  });

  return evidence;
}

async function buildIncidentReport(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId }).lean();
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const [incidents, locationHistory, heartbeats, evidence] = await Promise.all([
    Incident.find({ session: sessionId }).sort({ timestamp: 1 }).lean(),
    LocationPing.find({ session: sessionId }).sort({ capturedAt: 1 }).lean(),
    Heartbeat.find({ session: sessionId }).sort({ sequence: 1 }).lean(),
    Evidence.find({ session: sessionId }).sort({ uploadedAt: 1 }).lean(),
  ]);

  const missedHeartbeats = heartbeats.filter((h) => h.kind === 'missed').length;
  const checkIns = heartbeats.filter((h) => h.kind === 'checkin').length;

  const report = {
    sessionId: session._id,
    status: session.status,
    triggerType: session.triggerType,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    duration: session.endedAt
      ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 1000)
      : null,
    escalationLevel: session.escalationLevel,
    missedHeartbeatCount: session.missedHeartbeatCount,
    summary: {
      totalIncidents: incidents.length,
      totalLocationPings: locationHistory.length,
      totalHeartbeats: heartbeats.length,
      missedHeartbeats,
      checkIns,
      evidenceCount: evidence.length,
    },
    incidents,
    locationHistory,
    heartbeats,
    evidence,
  };

  await Incident.create({
    user: userId,
    session: sessionId,
    type: 'REPORT_GENERATED',
    message: 'Incident report generated',
    severity: 'info',
    metadata: {
      totalIncidents: incidents.length,
      evidenceCount: evidence.length,
    },
  });

  return report;
}

async function getSessionReport(sessionId, userId) {
  return buildIncidentReport(sessionId, userId);
}

module.exports = { saveEvidenceAudio, buildIncidentReport, getSessionReport };

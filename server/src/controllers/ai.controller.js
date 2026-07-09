const EmergencySession = require('../models/EmergencySession');
const Incident = require('../models/Incident');
const Evidence = require('../models/Evidence');
const LocationPing = require('../models/LocationPing');
const Heartbeat = require('../models/Heartbeat');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

function generateMockAnalysis(type, sessionId, data) {
  const base = {
    sessionId,
    generatedAt: new Date().toISOString(),
    model: 'mock-ai',
  };

  switch (type) {
    case 'evidence-summary':
      return {
        ...base,
        type: 'evidence_summary',
        summary: 'Audio evidence captured during the emergency session. No concerning verbal cues detected in the recording.',
        keyFindings: ['Recording duration indicates active user engagement', 'No explicit distress keywords identified'],
        recommendations: ['Review audio for contextual understanding', 'Cross-reference with incident timeline'],
      };
    case 'incident-summary':
      return {
        ...base,
        type: 'incident_summary',
        summary: `Emergency session ${sessionId} had ${data.incidentCount} incidents recorded. Session status: ${data.status}.`,
        timeline: `Session started via ${data.triggerType} and lasted approximately ${data.duration || 'unknown'} minutes.`,
        riskLevel: data.escalationLevel > 0 ? 'elevated' : 'low',
        recommendations: data.escalationLevel > 0
          ? ['Follow up with user for debriefing', 'Review escalation triggers', 'Update emergency contacts']
          : ['Session resolved without escalation', 'Standard post-incident review recommended'],
      };
    case 'safety-insights':
      return {
        ...base,
        type: 'safety_insights',
        insights: [
          'User maintained regular heartbeat check-ins during the session',
          'Location data shows expected movement patterns',
          'Trusted contacts were notified according to preferences',
        ],
        safetyScore: 72,
        suggestions: [
          'Consider reducing heartbeat interval for higher-risk areas',
          'Add at least one more trusted contact for redundancy',
          'Enable automatic evidence collection during future sessions',
        ],
      };
    default:
      return { ...base, message: 'Analysis completed' };
  }
}

async function callNvidia(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${errBody}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

async function callNvidiaWithRetry(prompt, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await callNvidia(prompt);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

const generateEvidenceSummary = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const evidence = await Evidence.find({ session: sessionId }).lean();
  const incidents = await Incident.find({ session: sessionId }).sort({ timestamp: 1 }).lean();

  if (NVIDIA_KEY) {
    try {
      const prompt = `Summarize the following evidence and incidents from an emergency session:\nEvidence: ${JSON.stringify(evidence)}\nIncidents: ${JSON.stringify(incidents)}\nProvide a concise summary of findings.`;
      const result = await callNvidiaWithRetry(prompt);
      return successResponse(res, { sessionId, summary: result, source: 'nvidia' }, 'Evidence summary generated');
    } catch (err) {
      const mock = generateMockAnalysis('evidence-summary', sessionId, { evidence, incidents });
      return successResponse(res, { ...mock, source: 'mock-fallback' }, 'Evidence summary generated (mock fallback)');
    }
  }

  const mock = generateMockAnalysis('evidence-summary', sessionId, { evidence, incidents });
  return successResponse(res, { ...mock, source: 'mock' }, 'Evidence summary generated');
});

const generateIncidentSummary = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const incidents = await Incident.find({ session: sessionId }).sort({ timestamp: 1 }).lean();
  const heartbeats = await Heartbeat.find({ session: sessionId }).lean();
  const locationPings = await LocationPing.find({ session: sessionId }).lean();

  if (NVIDIA_KEY) {
    try {
      const prompt = `Generate a comprehensive incident summary for the following emergency session:\nSession: ${JSON.stringify(session)}\nIncidents: ${JSON.stringify(incidents)}\nHeartbeats: ${JSON.stringify(heartbeats)}\nLocations: ${JSON.stringify(locationPings)}`;
      const result = await callNvidiaWithRetry(prompt);
      return successResponse(res, { sessionId, summary: result, source: 'nvidia' }, 'Incident summary generated');
    } catch (err) {
      const data = {
        status: session.status,
        triggerType: session.triggerType,
        duration: session.endedAt ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000) : null,
        escalationLevel: session.escalationLevel,
        incidentCount: incidents.length,
      };
      const mock = generateMockAnalysis('incident-summary', sessionId, data);
      return successResponse(res, { ...mock, source: 'mock-fallback' }, 'Incident summary generated (mock fallback)');
    }
  }

  const data = {
    status: session.status,
    triggerType: session.triggerType,
    duration: session.endedAt ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000) : null,
    escalationLevel: session.escalationLevel,
    incidentCount: incidents.length,
  };
  const mock = generateMockAnalysis('incident-summary', sessionId, data);
  return successResponse(res, { ...mock, source: 'mock' }, 'Incident summary generated');
});

const generateSafetyInsights = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const heartbeats = await Heartbeat.find({ session: sessionId }).lean();
  const locationPings = await LocationPing.find({ session: sessionId }).lean();

  if (NVIDIA_KEY) {
    try {
      const prompt = `Analyze the following emergency session data and provide safety insights and recommendations:\nSession: ${JSON.stringify(session)}\nHeartbeats: ${JSON.stringify(heartbeats)}\nLocations: ${JSON.stringify(locationPings)}`;
      const result = await callNvidiaWithRetry(prompt);
      return successResponse(res, { sessionId, insights: result, source: 'nvidia' }, 'Safety insights generated');
    } catch (err) {
      const mock = generateMockAnalysis('safety-insights', sessionId, { heartbeats, locationPings });
      return successResponse(res, { ...mock, source: 'mock-fallback' }, 'Safety insights generated (mock fallback)');
    }
  }

  const mock = generateMockAnalysis('safety-insights', sessionId, { heartbeats, locationPings });
  return successResponse(res, { ...mock, source: 'mock' }, 'Safety insights generated');
});

module.exports = { generateEvidenceSummary, generateIncidentSummary, generateSafetyInsights };

const LocationPing = require('../models/LocationPing');
const EmergencySession = require('../models/EmergencySession');
const socketService = require('./socket.service');

async function saveLocationPing(sessionId, userId, { latitude, longitude, accuracy, speed, heading, capturedAt }) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const ping = await LocationPing.create({
    user: userId,
    session: sessionId,
    latitude,
    longitude,
    accuracy: accuracy || 0,
    speed: speed || 0,
    heading: heading || 0,
    capturedAt: capturedAt || new Date(),
  });

  session.lastKnownLocation = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
  await session.save();

  socketService.emitLocationUpdate(sessionId, {
    type: 'LOCATION_UPDATED',
    sessionId,
    latitude,
    longitude,
    accuracy,
    speed,
    heading,
    capturedAt: ping.capturedAt,
  });

  return ping;
}

async function getLocationHistory(sessionId, userId, { page = 1, limit = 100 } = {}) {
  const skip = (page - 1) * limit;
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const [pings, total] = await Promise.all([
    LocationPing.find({ session: sessionId })
      .sort({ capturedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LocationPing.countDocuments({ session: sessionId }),
  ]);

  return { pings, total, page, limit };
}

async function getLastKnownLocation(sessionId, userId) {
  const session = await EmergencySession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    const err = new Error('Emergency session not found');
    err.statusCode = 404;
    throw err;
  }

  const lastPing = await LocationPing.findOne({ session: sessionId })
    .sort({ capturedAt: -1 })
    .lean();

  return lastPing || null;
}

module.exports = { saveLocationPing, getLocationHistory, getLastKnownLocation };

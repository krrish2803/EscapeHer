const heartbeatService = require('../services/heartbeat.service');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const sendHeartbeat = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { metadata } = req.body;
  const heartbeat = await heartbeatService.recordHeartbeat(sessionId, req.user._id, metadata);
  return successResponse(res, heartbeat, 'Heartbeat recorded');
});

const markHeartbeatMissed = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const heartbeat = await heartbeatService.recordMissedHeartbeat(sessionId, req.user._id);
  return successResponse(res, heartbeat, 'Missed heartbeat recorded');
});

const getHeartbeatStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const status = await heartbeatService.getHeartbeatStatus(sessionId, req.user._id);
  return successResponse(res, status, 'Heartbeat status fetched');
});

module.exports = { sendHeartbeat, markHeartbeatMissed, getHeartbeatStatus };

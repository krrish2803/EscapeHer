const mapsService = require('../services/maps.service');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const saveLocationPing = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { sessionId } = req.params;
  const { latitude, longitude, accuracy, speed, heading, capturedAt } = req.body;
  const ping = await mapsService.saveLocationPing(sessionId, req.user._id, {
    latitude,
    longitude,
    accuracy,
    speed,
    heading,
    capturedAt,
  });

  return successResponse(res, ping, 'Location saved', 201);
});

const getLocationHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const result = await mapsService.getLocationHistory(sessionId, req.user._id, { page, limit });
  return successResponse(res, result, 'Location history fetched');
});

const getLastKnownLocation = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const location = await mapsService.getLastKnownLocation(sessionId, req.user._id);
  return successResponse(res, location, 'Last known location fetched');
});

module.exports = { saveLocationPing, getLocationHistory, getLastKnownLocation };

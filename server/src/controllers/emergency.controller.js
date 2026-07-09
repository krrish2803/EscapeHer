const emergencyService = require('../services/emergency.service');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const startEmergency = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { triggerType, notes } = req.body;
  const session = await emergencyService.createEmergencySession(req.user._id, { triggerType, notes });
  return successResponse(res, session, 'Emergency session started', 201);
});

const stopEmergency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await emergencyService.stopEmergencySession(id, req.user._id);
  return successResponse(res, session, 'Emergency session stopped');
});

const getEmergencyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await emergencyService.getEmergencySessionById(id, req.user._id);
  return successResponse(res, session, 'Emergency session fetched');
});

const getEmergencyHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const result = await emergencyService.getEmergencyHistory(req.user._id, { page, limit });
  return successResponse(res, result, 'Emergency history fetched');
});

const updateEmergencyStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { id } = req.params;
  const { status, notes } = req.body;
  const session = await emergencyService.updateEmergencyStatus(id, req.user._id, { status, notes });
  return successResponse(res, session, `Session status updated to ${status}`);
});

module.exports = { startEmergency, stopEmergency, getEmergencyById, getEmergencyHistory, updateEmergencyStatus };

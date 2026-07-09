const incidentService = require('../services/incident.service');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const getIncidentTimeline = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const result = await incidentService.getIncidentTimeline(sessionId, req.user._id, { page, limit });
  return successResponse(res, result, 'Incident timeline fetched');
});

const getIncidentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const incident = await incidentService.getIncidentById(id, req.user._id);
  return successResponse(res, incident, 'Incident fetched');
});

const getIncidentHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const result = await incidentService.getIncidentHistory(req.user._id, { page, limit });
  return successResponse(res, result, 'Incident history fetched');
});

module.exports = { getIncidentTimeline, getIncidentById, getIncidentHistory };

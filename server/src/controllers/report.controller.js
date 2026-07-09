const reportService = require('../services/report.service');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const uploadEvidenceAudio = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!req.file) {
    return errorResponse(res, 'Audio file is required', 400);
  }

  const evidence = await reportService.saveEvidenceAudio({
    userId: req.user._id,
    sessionId,
    file: req.file,
  });

  return successResponse(res, evidence, 'Audio evidence uploaded', 201);
});

const createIncidentReport = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const report = await reportService.buildIncidentReport(sessionId, req.user._id);
  return successResponse(res, report, 'Incident report generated');
});

const getSessionReport = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const report = await reportService.getSessionReport(sessionId, req.user._id);
  return successResponse(res, report, 'Session report fetched');
});

module.exports = { uploadEvidenceAudio, createIncidentReport, getSessionReport };

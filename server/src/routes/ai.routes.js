const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth');

router.post('/:sessionId/evidence-summary', authenticate, aiController.generateEvidenceSummary);
router.post('/:sessionId/incident-summary', authenticate, aiController.generateIncidentSummary);
router.post('/:sessionId/safety-insights', authenticate, aiController.generateSafetyInsights);

module.exports = router;

const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incident.controller');
const { authenticate } = require('../middleware/auth');

router.get('/history', authenticate, incidentController.getIncidentHistory);
router.get('/:id', authenticate, incidentController.getIncidentById);
router.get('/session/:sessionId/timeline', authenticate, incidentController.getIncidentTimeline);

module.exports = router;

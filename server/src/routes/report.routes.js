const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth');
const { uploadAudioMiddleware } = require('../middleware/upload');

router.post('/:sessionId/audio', authenticate, uploadAudioMiddleware, reportController.uploadEvidenceAudio);
router.post('/:sessionId/create', authenticate, reportController.createIncidentReport);
router.get('/:sessionId', authenticate, reportController.getSessionReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const heartbeatController = require('../controllers/heartbeat.controller');
const { authenticate } = require('../middleware/auth');

router.post('/:sessionId/check-in', authenticate, heartbeatController.sendHeartbeat);
router.post('/:sessionId/missed', authenticate, heartbeatController.markHeartbeatMissed);
router.get('/:sessionId/status', authenticate, heartbeatController.getHeartbeatStatus);

module.exports = router;

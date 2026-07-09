const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');
const { authenticate } = require('../middleware/auth');
const {
  startEmergencyValidation,
  updateStatusValidation,
} = require('../validators/emergency.validator');

router.post('/start', authenticate, startEmergencyValidation, emergencyController.startEmergency);
router.post('/:id/stop', authenticate, emergencyController.stopEmergency);
router.patch('/:id/status', authenticate, updateStatusValidation, emergencyController.updateEmergencyStatus);
router.get('/:id', authenticate, emergencyController.getEmergencyById);
router.get('/', authenticate, emergencyController.getEmergencyHistory);

module.exports = router;

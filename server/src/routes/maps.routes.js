const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/maps.controller');
const { authenticate } = require('../middleware/auth');
const { locationValidation } = require('../validators/emergency.validator');

router.post('/:sessionId/location', authenticate, locationValidation, mapsController.saveLocationPing);
router.get('/:sessionId/history', authenticate, mapsController.getLocationHistory);
router.get('/:sessionId/last-location', authenticate, mapsController.getLastKnownLocation);

module.exports = router;

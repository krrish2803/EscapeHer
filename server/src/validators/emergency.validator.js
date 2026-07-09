const { body } = require('express-validator');

const startEmergencyValidation = [
  body('triggerType')
    .optional()
    .isIn(['manual_sos', 'heartbeat_escalation', 'voice_trigger', 'auto_detect'])
    .withMessage('Invalid trigger type'),
  body('notes').optional().trim().isString(),
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'escalated', 'resolved', 'cancelled'])
    .withMessage('Invalid status value'),
  body('notes').optional().trim().isString(),
];

const heartbeatValidation = [
  body('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('metadata').optional().isObject(),
];

const locationValidation = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('accuracy').optional().isFloat({ min: 0 }),
  body('speed').optional().isFloat({ min: 0 }),
  body('heading').optional().isFloat({ min: 0, max: 360 }),
];

module.exports = {
  startEmergencyValidation,
  updateStatusValidation,
  heartbeatValidation,
  locationValidation,
};

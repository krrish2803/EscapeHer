const { body } = require('express-validator');

const addContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('relation')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Relation must be at most 50 characters'),
  body('priority')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Priority must be between 1 and 10'),
  body('notifyBy')
    .optional()
    .isArray()
    .withMessage('notifyBy must be an array'),
  body('notifyBy.*')
    .optional()
    .isIn(['sms', 'push', 'email'])
    .withMessage('Invalid notification method'),
  body('isPrimary').optional().isBoolean(),
];

const updateContactValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('phone').optional().trim(),
  body('relation')
    .optional()
    .trim()
    .isLength({ max: 50 }),
  body('priority')
    .optional()
    .isInt({ min: 1, max: 10 }),
  body('notifyBy')
    .optional()
    .isArray(),
  body('notifyBy.*')
    .optional()
    .isIn(['sms', 'push', 'email']),
  body('isPrimary').optional().isBoolean(),
];

module.exports = { addContactValidation, updateContactValidation };

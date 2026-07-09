const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth');
const { addContactValidation, updateContactValidation } = require('../validators/contact.validator');

router.post('/', authenticate, addContactValidation, contactController.addContact);
router.get('/', authenticate, contactController.getContacts);
router.put('/:id', authenticate, updateContactValidation, contactController.updateContact);
router.delete('/:id', authenticate, contactController.deleteContact);

module.exports = router;

const TrustedContact = require('../models/TrustedContact');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const addContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { name, phone, relation, priority, notifyBy, isPrimary } = req.body;

  if (isPrimary) {
    await TrustedContact.updateMany({ user: req.user._id, isPrimary: true }, { isPrimary: false });
  }

  const contact = await TrustedContact.create({
    user: req.user._id,
    name,
    phone,
    relation,
    priority,
    notifyBy,
    isPrimary,
  });

  return successResponse(res, contact, 'Trusted contact added', 201);
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await TrustedContact.find({ user: req.user._id })
    .sort({ priority: -1 })
    .lean();
  return successResponse(res, contacts, 'Trusted contacts fetched');
});

const updateContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { id } = req.params;
  const allowedFields = ['name', 'phone', 'relation', 'priority', 'notifyBy', 'isPrimary'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.isPrimary) {
    await TrustedContact.updateMany(
      { user: req.user._id, _id: { $ne: id }, isPrimary: true },
      { isPrimary: false }
    );
  }

  const contact = await TrustedContact.findOneAndUpdate(
    { _id: id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!contact) {
    return errorResponse(res, 'Trusted contact not found', 404);
  }

  return successResponse(res, contact, 'Trusted contact updated');
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await TrustedContact.findOneAndDelete({ _id: id, user: req.user._id });
  if (!contact) {
    return errorResponse(res, 'Trusted contact not found', 404);
  }
  return successResponse(res, null, 'Trusted contact deleted');
});

module.exports = { addContact, getContacts, updateContact, deleteContact };

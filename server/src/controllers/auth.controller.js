const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { name, email, password, phone } = req.body;
  const result = await authService.registerUser({ name, email, password, phone });
  return successResponse(res, result, 'Account created successfully', 201);
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map((e) => e.msg));
  }

  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  return successResponse(res, result, 'Login successful');
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  return successResponse(res, user, 'User fetched successfully');
});

module.exports = { signup, login, getMe };

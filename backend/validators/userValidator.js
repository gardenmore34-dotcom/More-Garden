import { body } from 'express-validator';

export const registerValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidationRules = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// New Google OAuth validation
export const googleAuthValidationRules = [
  body('email')
    .notEmpty().withMessage('Google email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('name')
    .notEmpty().withMessage('Google name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('googleId')
    .notEmpty().withMessage('Google ID is required')
    .isString().withMessage('Google ID must be a string'),

  body('picture')
    .optional()
    .isURL().withMessage('Profile picture must be a valid URL'),
];

// Profile update validation
export const updateProfileValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('address')
    .optional()
    .isString().withMessage('Address must be a string'),

  body('pincode')
    .optional()
    .isString().withMessage('Pincode must be a string'),

  body('profilePicture')
    .optional()
    .isURL().withMessage('Profile picture must be a valid URL'),
];

// Password reset validation
export const resetPasswordValidationRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Forgot password validation
export const forgotPasswordValidationRules = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
];

// OTP verification validation
export const verifyOtpValidationRules = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

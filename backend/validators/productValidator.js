// validators/productValidator.js
import { body } from 'express-validator';

export const productValidationRules = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('slug')
    .notEmpty().withMessage('Slug is required')
    .isSlug().withMessage('Slug must be URL friendly'),

  body('description')
    .notEmpty().withMessage('Description is required'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'])
    .withMessage('Invalid category'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),

  body('discountPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discount price must be a non-negative number'),

  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
];

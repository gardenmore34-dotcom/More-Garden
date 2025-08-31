import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController.js';
import upload from '../middleware/cloudinaryStorage.js';

const router = express.Router();

// categoryRoutes.js

router.post('/create', upload.single('image'), createCategory); // define this first
router.get('/', getAllCategories); // get all categories

export default router;

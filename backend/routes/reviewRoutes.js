// routes/reviewRoutes.js
import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/create', createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:reviewId', deleteReview);

export default router;

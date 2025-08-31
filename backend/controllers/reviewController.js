// controllers/reviewController.js
import { Review } from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { userId, avatar, productId, rating, comment,title } = req.body;
    const review = new Review({ userId, avatar, productId, rating, comment,title });
    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

// controllers/reviewController.js
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate('userId', 'name');
    const totalReviews = reviews.length;

    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (ratingSum / totalReviews).toFixed(2);

    // Ratings breakdown
    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: reviews.filter((r) => r.rating === star).length,
    }));

    res.json({ reviews, totalReviews, averageRating, breakdown });
  } catch (err) {
    console.error('Error fetching product reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, title } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment, title },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated', review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
};



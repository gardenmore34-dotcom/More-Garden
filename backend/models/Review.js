import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
      required: true
     },
  productId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true
 },
  rating: { type: Number, 
    required: true, 
    min: 1,
    max: 5
  },
    title: { 
        type: String, 
        required: true 
    }, 
  comment: { 
    type: String 
  },
  verified: { 
    type: Boolean, 
    default: false 
  }, // optional
  createdAt: { type: Date, 
    default: Date.now 
  },
});

export const Review = mongoose.model('Review', reviewSchema);

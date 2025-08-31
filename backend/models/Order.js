// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      name: String,
      price: Number,
    },
  ],
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ['online', 'COD'],
    required: true,
  },
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);

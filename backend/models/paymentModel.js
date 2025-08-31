import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);

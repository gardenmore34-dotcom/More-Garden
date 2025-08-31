import mongoose from 'mongoose';

// Define sub-schema for an individual address
const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  addresses: [addressSchema], // Replaces flat address & pincode fields
  otp: { type: String, default: '' },
  otpExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

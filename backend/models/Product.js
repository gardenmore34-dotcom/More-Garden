import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, text: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true, text: true },
  type: {
    type: String,
    required: true,
    enum: ['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'],
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }
  ],
  tags: { type: [String], default: [], index: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  images: [{ url: String, alt: String }],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  bulk: { type: Boolean, default: false, required: true },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);

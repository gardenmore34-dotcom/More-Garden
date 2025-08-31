import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // Cloudinary URL
  },
  { timestamps: true }
);

// ✅ Fix OverwriteModelError
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;

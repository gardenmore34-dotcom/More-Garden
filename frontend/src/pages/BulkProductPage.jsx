// src/pages/BulkProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/productAPI";
import ProductShowcase from "../components/ProductShowcase";
import ProductReviews from "../components/ProductReview";
import { getUserIdFromToken } from "../utils/authUtils";


const BulkProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = getUserIdFromToken();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    message: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bulk order submitted:", formData);
    alert("Your bulk enquiry has been submitted!");
    // 👉 Later connect with /api/bulk-orders
  };

  if (!product) return <p className="text-center py-20">Loading...</p>;

  const discountPercentage =
    product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F5FAF4] px-4 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-lg">
        
        {/* Product Image Section */}
        <div>
          <img
            src={selectedImage || "https://via.placeholder.com/500x400?text=No+Image"}
            alt={product.name}
            className="w-full md:w-[99%] max-h-[90vh] md:h-[750px] object-contain rounded-2xl border p-2 border-green-600"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.alt}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                  selectedImage === img.url ? "border-green-600" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info + Bulk Enquiry Form */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-3">
              {discountPercentage > 0 && (
                <span className="bg-yellow-200 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.featured && (
                <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold text-[#256029] mb-3">{product.name}</h1>

            {/* Pricing */}
            <div className="mb-3">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-2xl font-bold text-[#1E4D2B] mr-3">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#1E4D2B]">₹{product.price}</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-6">
              {product.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#E6F4EA] text-[#2B5D3B] text-sm px-3 py-1 rounded-full font-medium shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full">
              <hr className="py-1 border-black" />
            </div>

            {/* Bulk Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 className="text-xl font-bold text-green-700 mb-4">Bulk Enquiry Form</h2>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name (Optional)"
                value={formData.company}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity (min 30)"
                min="30"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg w-full"
              />
              <textarea
                name="message"
                placeholder="Any special requirements?"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="p-3 border rounded-lg w-full"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
              >
                Submit Bulk Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16">
          <ProductShowcase 
            title="You May Also Like" 
            type="similar"
            categorySlug={product?.category?.toLowerCase()}
            productType={product?.type}
            excludeProductId={product?._id}
            limit={4}
          />
        </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <ProductReviews productId={product._id} userId={userId} />
      </div>
    </div>
  );
};

export default BulkProductPage;

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addToCartAPI } from '../api/cartAPI';

const ProductCard = ({ product }) => {
  const [size, setSize] = useState('M');
  const [pot, setPot] = useState(product.potOptions?.[0] || 'Default');

  const navigate = useNavigate();

  // Check if product is a plant
  const isPlant = product.type === 'Plants' || product.category?.toLowerCase() === 'plants';

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login first to add items to cart');
      navigate('/auth');
      return;
    }

    try {
      // Only send size and pot options for plants
      const options = isPlant ? { size, pot } : {};
      await addToCartAPI(userId, product, 1, options);
      toast.success('🛒 Added to cart!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <>
      {/* Desktop View */}
      <div
        onClick={handleCardClick}
        className="hidden md:block bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition cursor-pointer"
      >
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="mt-3">
          <div className="flex items-center text-sm text-yellow-600 font-semibold mb-1">
            ⭐ {product.rating || '4.5'} | {product.reviewsCount || '200'}
          </div>

          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>

          <div className="text-green-800 font-semibold text-base mt-1">
            ₹{product.discountPrice || product.price}{' '}
            {product.discountPrice && (
              <span className="text-gray-400 line-through text-sm ml-1">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {product.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Size Selector - Desktop (Only for Plants) */}
          {isPlant && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 mb-1">Select Size</p>
              <div className="flex gap-2">
                {['S', 'M', 'L'].map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSize(s);
                    }}
                    className={`w-8 h-8 rounded-full border text-sm font-medium ${
                      size === s ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pot Selector - Desktop (Only for Plants) */}
          {isPlant && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-600 mb-1">Select Planter</p>
              <div className="flex gap-2 flex-wrap">
                {(product.potOptions || ['Default', 'Premium']).map((p) => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPot(p);
                    }}
                    className={`px-3 py-1 rounded-full border text-xs font-medium ${
                      pot === p ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition text-base font-medium"
          >
            Add to Basket
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div
        onClick={handleCardClick}
        className="block md:hidden bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition cursor-pointer"
      >
        {/* Image */}
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="w-full h-32 object-cover rounded-xl"
        />

        <div className="mt-2">
          {/* Rating */}
          <div className="flex items-center text-xs text-yellow-600 font-semibold mb-1">
            ⭐ {product.rating || '4.5'} | {product.reviewsCount || '200'}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</h3>

          {/* Price */}
          <div className="text-green-800 font-semibold text-sm mt-1">
            ₹{product.discountPrice || product.price}{' '}
            {product.discountPrice && (
              <span className="text-gray-400 line-through text-xs ml-1">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags?.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                +{product.tags.length - 2}
              </span>
            )}
          </div>

          {/* Size Selector - Mobile (Only for Plants) */}
          {isPlant && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-600 mb-1">Select Size</p>
              <div className="flex gap-1">
                {['S', 'M', 'L'].map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSize(s);
                    }}
                    className={`w-6 h-6 rounded-full border text-xs font-medium ${
                      size === s ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pot Selector - Mobile (Only for Plants) */}
          {isPlant && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-600 mb-1">Select Planter</p>
              <div className="flex gap-1 flex-wrap">
                {(product.potOptions || ['Default', 'Premium']).map((p) => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPot(p);
                    }}
                    className={`px-2 py-1 rounded-full border text-xs font-medium ${
                      pot === p ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Basket */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-green-700 text-white py-1.5 rounded-lg hover:bg-green-800 transition text-sm font-medium"
          >
            Add to Basket
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

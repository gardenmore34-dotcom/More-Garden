import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addToCartAPI } from '../api/cartAPI';

const ProductCard = ({ product }) => {
  const [size, setSize] = useState('M');
  const [pot, setPot] = useState(product.potOptions?.[0] || 'Default');
  const [color, setColor] = useState(product.colorOptions?.[0] || 'green');

  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId');
    try {
      await addToCartAPI(userId, product, 1, { size, pot, color });
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
      {/* Desktop View (unchanged) */}
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

          {/* Size, Pot, Color (desktop only) */}
          {/* ... keep your existing size, pot, color selectors ... */}

          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition text-base"
          >
            Add to Basket
          </button>
        </div>
      </div>

      {/* Mobile View (new layout like screenshot) */}
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
          <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>

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
            {product.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Size Selector */}
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600 mb-1">Select Size</p>
            <div className="flex gap-1">
              {['S', 'M'].map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSize(s);
                  }}
                  className={`w-6 h-6 rounded-full border text-xs ${
                    size === s ? 'bg-green-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Basket */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-green-700 text-white py-1.5 rounded-lg hover:bg-green-800 transition text-sm"
          >
            Add to Basket
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

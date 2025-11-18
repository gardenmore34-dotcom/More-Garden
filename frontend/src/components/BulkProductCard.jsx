import React from "react";
import { Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const BulkProductCard = ({ product }) => {

   const navigate = useNavigate();

  const discount =
    product.oldPrice && product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handleCardClick = () => {
    navigate(`/bulk/${product.slug}`);
  };

  return (
    <div 
    onClick={handleCardClick}
    className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="relative">
        {discount && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="w-full h-60 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        {product.rating && (
          <p className="text-sm text-gray-700 mb-1">
            ⭐ {product.rating} ({product.numReviews || 0})
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-green-700 font-bold">₹{product.price}</span>
          {product.oldPrice && (
            <span className="line-through text-gray-500 text-sm">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        {/* Button */}
        <div className="mt-3">
          {product.inStock > 0 ? (
            <Link
              to={`/bulk/${product.slug}`}
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            >
              View Product
            </Link>
          ) : (
            <button
              disabled
              className="block w-full text-center bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkProductCard;

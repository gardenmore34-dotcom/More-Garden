// src/pages/ProductInfo.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import { addToCartAPI } from '../api/cartAPI';
import { getProductBySlug, getAllProducts } from '../api/productAPI';
import { getUserIdFromToken } from '../utils/authUtils';
import ProductShowcase from '../components/ProductShowcase';
import  PayPopup from '../components/PayPopup';
import ProductReviews from '../components/ProductReview';


const ProductInfo = () => {
  const { slug } = useParams();
  const userId = getUserIdFromToken();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedPlanter, setSelectedPlanter] = useState('GroPot');
  const [selectedColor, setSelectedColor] = useState('Ivory');
  const [makeGift, setMakeGift] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isPayPopupOpen, setIsPayPopupOpen] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        if (product?.category) {
          const res = await getAllProducts();
          const filtered = res.products?.filter(
            (p) => p.category === product.category && p._id !== product._id
          );
          setSimilarProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching similar products:', err);
      }
    };
    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const discountPercentage = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleQuantityChange = (type) => {
    setQuantity(prev => type === 'inc' ? prev + 1 : prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = async () => {
  try {
    await addToCartAPI(userId, product, 1, {
      size: selectedSize,
      planter: selectedPlanter,
      color: selectedColor
    });
    toast.success('🛒 Added to cart!');
  } catch (err) {
    console.error(err);
    toast.error('Failed to add to cart');
  }
};

  return (
    <>
    <div className="min-h-screen bg-[#F5FAF4] px-4 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-lg">
        {/* Image Section */}
        <div>
          <img
            src={selectedImage || 'https://via.placeholder.com/500x400?text=No+Image'}
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
                  selectedImage === img.url ? 'border-green-600' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Badge Row */}
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

            <p className="text-green-700 text-base mb-2">🌼 {product.rating || 'N/A'} (verified reviews)</p>

            <div className="flex gap-2 flex-wrap mb-6">
              {product.tags?.map((tag, idx) => (
                <span key={idx} className="bg-[#E6F4EA] text-[#2B5D3B] text-sm px-3 py-1 rounded-full font-medium shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="w-full ">
              <hr className="py-1 border-black" />
            </div>

            {/* Variants */}
            <div className="space-y-3 mb-6">
              <div>
                <h4 className="text-[15px] font-bold text-[#2D4739] mb-1">SELECT SIZE</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Small', 'Medium', 'Large'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-full border text-sm ${
                        selectedSize === size ? 'bg-green-700 text-white' : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[15px] font-bold text-[#2D4739] mb-1">SELECT PLANTER</h4>
                <div className="flex gap-2 flex-wrap">
                  {['GroPot', 'Krish', 'Lagos', 'Jar', 'Roma', 'Diamond'].map(pot => (
                    <button
                      key={pot}
                      onClick={() => setSelectedPlanter(pot)}
                      className={`px-3 py-1 rounded-full border text-sm ${
                        selectedPlanter === pot ? 'bg-green-700 text-white' : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {pot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[15px] font-bold text-[#2D4739] mb-1">COLOR</h4>
                <div className="flex gap-2">
                  {['Ivory', 'Terracotta', 'Black'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-green-700' : 'border-gray-300'
                      }`} style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-[14px] text-[#374151] font-medium mt-2">
                <input
                  type="checkbox"
                  checked={makeGift}
                  onChange={() => setMakeGift(!makeGift)}
                />
                🎁 Make this a gift
              </label>
            </div>

            {/* Quantity and Buttons */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={() => handleQuantityChange('dec')} className="px-3 py-1 bg-gray-200">-</button>
                <span className="px-4 py-1">{quantity}</span>
                <button onClick={() => handleQuantityChange('inc')} className="px-3 py-1 bg-gray-200">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#256029] text-white px-6 py-3 rounded-xl hover:bg-[#1B4821] transition text-sm font-semibold shadow-md" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button
                onClick={() => setIsPayPopupOpen(true)}
                className="bg-[#256029] text-white px-6 py-3 rounded-xl hover:bg-[#1B4821] transition text-sm font-semibold shadow-md"
              >
                Buy Now
              </button>
              <PayPopup
                  isOpen={isPayPopupOpen}
                  onClose={() => setIsPayPopupOpen(false)}
                  cartItems={[{ ...product, quantity }]}
                  total={(product.discountPrice > 0 ? product.discountPrice : product.price) * quantity}
                  userId={userId}
                  onSuccess={() => {
                    toast.success('✅ Order placed!');
                    setIsPayPopupOpen(false);
                  }}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Also Buy Section */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <ProductShowcase title="You May Also Like" products={similarProducts} />
        </div>
      )}
    </div>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ProductReviews productId={product._id} userId={userId} />
      </div>
      </>
  );
};

export default ProductInfo;

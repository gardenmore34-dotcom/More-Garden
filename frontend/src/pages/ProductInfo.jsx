// src/pages/ProductInfo.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { addToCartAPI } from '../api/cartAPI';
import { getProductBySlug, getAllProducts } from '../api/productAPI';
import { getUserIdFromToken } from '../utils/authUtils';
import ProductShowcase from '../components/ProductShowcase';
import PayPopup from '../components/PayPopup';
import ProductReviews from '../components/ProductReview';

const ProductInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedPlanter, setSelectedPlanter] = useState('GroPot');
  const [selectedColor, setSelectedColor] = useState('Ivory');
  const [selectedPackSize, setSelectedPackSize] = useState('10g'); // For seeds
  const [selectedFertilizerSize, setSelectedFertilizerSize] = useState('500g'); // For fertilizers
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
    if (!userId) {
      toast.error('Please login first to add items to cart');
      navigate('/auth');
      return;
    }

    try {
      const options = {};
      // Only add size and planter options for plants
      if (product.type === 'Plants') {
        options.size = selectedSize;
        options.planter = selectedPlanter;
        options.color = selectedColor;
      }
      // Add pack size for seeds
      if (product.type === 'Seeds') {
        options.packSize = selectedPackSize;
      }
      // Add fertilizer size for fertilizers
      if (product.type === 'Fertilizers') {
        options.fertilizerSize = selectedFertilizerSize;
      }

      await addToCartAPI(userId, product, quantity, options);
      toast.success('🛒 Added to cart!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!userId) {
      toast.error('Please login first to place an order');
      navigate('/auth');
      return;
    }
    setIsPayPopupOpen(true);
  };

  // Function to check product types
  const isPlant = product.type === 'Plants';
  const isPot = product.type === 'Pots' || product.category?.toLowerCase().includes('pot');
  const isTool = product.type === 'Tools' || product.category?.toLowerCase().includes('tool');
  const isSeed = product.type === 'Seeds' || product.category?.toLowerCase().includes('seed');
  const isFertilizer = product.type === 'Fertilizers' || product.category?.toLowerCase().includes('fertilizer');

  // Plant-specific variants (UNCHANGED - your original code)
  const renderPlantVariants = () => (
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
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Fertilizers-specific variants
  const renderFertilizerVariants = () => (
    <div className="space-y-4 mb-6">
      {/* Product Description */}
      {product.description && (
        <div className="mb-6">
          <h4 className="text-[16px] font-bold text-[#2D4739] mb-2">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            {product.description}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">PACKAGE SIZE</h4>
        <div className="flex gap-2 flex-wrap">
          {['250g', '500g', '1kg', '2kg', '5kg'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedFertilizerSize(size)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                selectedFertilizerSize === size ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 text-gray-700 hover:border-emerald-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      

      

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">USAGE INSTRUCTIONS</h4>
        <div className="space-y-2">
          {[
            'Mix 2-3 teaspoons per plant',
            'Apply around the base of plants',
            'Water thoroughly after application',
            'Best used during growing season'
          ].map((instruction, index) => (
            <div key={instruction} className="flex items-center gap-2">
              <span className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700">{instruction}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-100 p-4 rounded-lg border border-emerald-300">
        <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
          <span>🌱</span>
          Best For
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Flowering Plants', 'Vegetables', 'Herbs', 'Fruit Trees', 'Indoor Plants'].map(plantType => (
            <span key={plantType} className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
              {plantType}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Seeds-specific variants
  const renderSeedVariants = () => (
    <div className="space-y-4 mb-6">
      {/* Product Description */}
      {product.description && (
        <div className="mb-6">
          <h4 className="text-[16px] font-bold text-[#2D4739] mb-2">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            {product.description}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">PACK SIZE</h4>
        <div className="flex gap-2 flex-wrap">
          {['5g', '10g', '25g', '50g', '100g'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedPackSize(size)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                selectedPackSize === size ? 'bg-yellow-600 text-white border-yellow-600' : 'border-gray-300 text-gray-700 hover:border-yellow-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">GROWING INFORMATION</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <span className="font-semibold text-yellow-800">Germination:</span>
            <p className="text-yellow-600">7-14 days</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <span className="font-semibold text-yellow-800">Sunlight:</span>
            <p className="text-yellow-600">Full Sun</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <span className="font-semibold text-yellow-800">Watering:</span>
            <p className="text-yellow-600">Moderate</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <span className="font-semibold text-yellow-800">Season:</span>
            <p className="text-yellow-600">All Year</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">PLANTING TIPS</h4>
        <div className="space-y-2">
          {[
            'Soak seeds for 6-8 hours before planting',
            'Plant in well-draining soil',
            'Maintain consistent moisture',
            'Provide adequate sunlight'
          ].map(tip => (
            <div key={tip} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
              <span className="text-sm text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Pot-specific variants with description
  const renderPotVariants = () => (
    <div className="space-y-4 mb-6">
      {/* Product Description */}
      {product.description && (
        <div className="mb-6">
          <h4 className="text-[16px] font-bold text-[#2D4739] mb-2">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-orange-50 p-4 rounded-lg border border-orange-200">
            {product.description}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">SIZE</h4>
        <div className="flex gap-2 flex-wrap">
          {['4 Inch', '5 Inch', '6 Inch', '8 Inch', '10 Inch'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                selectedSize === size ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300 text-gray-700 hover:border-orange-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">MATERIAL</h4>
        <div className="flex gap-2 flex-wrap">
          {['Ceramic', 'Terracotta', 'Plastic', 'Metal'].map(material => (
            <span
              key={material}
              className="px-3 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded-full text-sm font-medium"
            >
              {material}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">COLOR</h4>
        <div className="flex gap-3">
          {['Grey', 'Brown', 'White', 'Black'].map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition ${
                selectedColor === color ? 'border-orange-600 scale-110' : 'border-gray-300 hover:border-orange-400'
              }`}
              style={{ backgroundColor: color.toLowerCase() === 'grey' ? '#6b7280' : color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Tool-specific variants with description
  const renderToolVariants = () => (
    <div className="space-y-4 mb-6">
      {/* Product Description */}
      {product.description && (
        <div className="mb-6">
          <h4 className="text-[16px] font-bold text-[#2D4739] mb-2">Description</h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
            {product.description}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">SPECIFICATIONS</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">Material:</span>
            <p className="text-blue-600">High-grade Steel</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">Handle:</span>
            <p className="text-blue-600">Ergonomic Grip</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">Weight:</span>
            <p className="text-blue-600">Lightweight</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">Warranty:</span>
            <p className="text-blue-600">1 Year</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[15px] font-bold text-[#2D4739] mb-2">KEY FEATURES</h4>
        <div className="space-y-2">
          {['Rust Resistant Coating', 'Sharp Cutting Edge', 'Comfortable Grip', 'Durable Construction'].map(feature => (
            <div key={feature} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Get appropriate button colors based on product type
  const getButtonColors = () => {
    if (isPot) return 'bg-orange-600 hover:bg-orange-700';
    if (isTool) return 'bg-blue-600 hover:bg-blue-700';
    if (isSeed) return 'bg-yellow-600 hover:bg-yellow-700';
    if (isFertilizer) return 'bg-emerald-600 hover:bg-emerald-700';
    return 'bg-[#256029] hover:bg-[#1B4821]'; // Original plant colors
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3F9F3] md:px-12 pb-6 md:py-6 md:pb-8">
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

              <div className="w-full">
                <hr className="py-1 border-black" />
              </div>

              {/* Conditional Variants based on product type */}
              {isPlant && renderPlantVariants()}
              {isPot && renderPotVariants()}
              {isTool && renderToolVariants()}
              {isSeed && renderSeedVariants()}
              {isFertilizer && renderFertilizerVariants()}

              {/* Gift option */}
              <label className="flex items-center gap-2 text-[14px] text-[#374151] font-medium mt-2">
                <input
                  type="checkbox"
                  checked={makeGift}
                  onChange={() => setMakeGift(!makeGift)}
                />
                🎁 Make this a gift
              </label>

              {/* Quantity and Buttons */}
              <div className="flex items-center gap-4 mb-4 mt-4">
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button onClick={() => handleQuantityChange('dec')} className="px-3 py-1 bg-gray-200">-</button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button onClick={() => handleQuantityChange('inc')} className="px-3 py-1 bg-gray-200">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className={`${getButtonColors()} text-white px-6 py-3 rounded-xl transition text-sm font-semibold shadow-md`}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className={`${getButtonColors()} text-white px-6 py-3 rounded-xl transition text-sm font-semibold shadow-md`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <ProductReviews productId={product._id} userId={userId} />
      </div>

      {/* PayPopup */}
      {userId && (
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
      )}
    </>
  );
};

export default ProductInfo;

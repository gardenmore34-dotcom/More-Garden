import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory, getAllProducts } from '../api/productAPI';

const ProductShowcase = ({ 
  title, 
  products = [], 
  categorySlug = null, 
  type = 'manual', // 'manual', 'similar', 'category'
  limit = 8,
  excludeProductId = null,
  showViewAll = false,
  viewAllLink = null,
  productType = null // New prop for fallback type search
}) => {
  const [showcaseProducts, setShowcaseProducts] = useState(products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSearchType, setCurrentSearchType] = useState('category'); // Track what we're searching by

  useEffect(() => {
    const fetchProducts = async () => {
      if (type === 'manual') {
        setShowcaseProducts(products);
        return;
      }

      if (!categorySlug && !productType) {
        console.warn('CategorySlug or productType is required for category and similar types');
        setShowcaseProducts([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let fetchedProducts = [];
        
        // First try: Search by category
        if (categorySlug) {
          setCurrentSearchType('category');
          try {
            const res = await getProductsByCategory(categorySlug, limit + 5); // Get a few extra for filtering
            fetchedProducts = res.products || [];
            
            // Filter out the current product if needed
            if (excludeProductId) {
              fetchedProducts = fetchedProducts.filter(p => p._id !== excludeProductId);
            }
            
            
          } catch (categoryError) {
            console.warn('Category search failed:', categoryError);
            fetchedProducts = [];
          }
        }

        // Fallback: If no products found in category and we have productType, search by type
        if (fetchedProducts.length === 0 && productType) {
          setCurrentSearchType('type');
        
          
          try {
            const res = await getAllProducts();
            const allProducts = res.products || [];
            
            // Filter by type (case insensitive)
            fetchedProducts = allProducts.filter(p => 
              p.type && p.type.toLowerCase() === productType.toLowerCase()
            );
            
            // Filter out the current product if needed
            if (excludeProductId) {
              fetchedProducts = fetchedProducts.filter(p => p._id !== excludeProductId);
            }
            
         
          } catch (typeError) {
            console.warn('Type search failed:', typeError);
            fetchedProducts = [];
          }
        }

        // Final fallback: Get random products if still no results
        if (fetchedProducts.length === 0) {
          setCurrentSearchType('random');
         
          
          try {
            const res = await getAllProducts();
            const allProducts = res.products || [];
            
            // Filter out current product and get random products
            let randomProducts = allProducts.filter(p => p._id !== excludeProductId);
            
            // Shuffle array for random selection
            randomProducts = randomProducts.sort(() => 0.5 - Math.random());
            fetchedProducts = randomProducts;
            
            
          } catch (randomError) {
            console.error('Random search also failed:', randomError);
            fetchedProducts = [];
          }
        }

        // Limit the number of products shown
        setShowcaseProducts(fetchedProducts.slice(0, limit));
        
      } catch (error) {
        console.error('Error fetching showcase products:', error);
        setError('Failed to load products');
        setShowcaseProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, categorySlug, productType, limit, excludeProductId]); // Removed 'products' from dependencies

  // Separate useEffect for manual type to handle products prop changes
  useEffect(() => {
    if (type === 'manual') {
      setShowcaseProducts(products);
    }
  }, [products, type]);

  if (loading) {
    return (
      <section className="mt-8 md:mt-12">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-2">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-700 rounded-full"></div>
            <h2 className="text-lg md:text-2xl font-bold text-green-800">{title}</h2>
          </div>
        </div>
        
        {/* Mobile Loading */}
        <div className="md:hidden">
          <div className="flex space-x-3 overflow-x-hidden pb-4 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-40">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl h-48 shadow-sm">
                  <div className="p-3">
                    <div className="bg-gray-300 h-32 rounded-xl mb-2 animate-pulse"></div>
                    <div className="bg-gray-300 h-3 rounded mb-1 animate-pulse"></div>
                    <div className="bg-gray-300 h-3 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Loading */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl h-64 shadow-sm">
              <div className="p-4">
                <div className="bg-gray-300 h-40 rounded-xl mb-3 animate-pulse"></div>
                <div className="bg-gray-300 h-4 rounded mb-2 animate-pulse"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 md:mt-12">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-2">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
            <h2 className="text-lg md:text-2xl font-bold text-green-800">{title}</h2>
          </div>
        </div>
        <div className="text-center py-12 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-200 mx-4 md:mx-0">
          <div className="text-4xl mb-4 animate-bounce">🌿💔</div>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </section>
    );
  }

  if (!showcaseProducts.length) {
    return null;
  }

  // Dynamic title based on search type
  const getDynamicTitle = () => {
    if (type === 'manual') return title;
    
    switch (currentSearchType) {
      case 'category':
        return title;
      case 'type':
        return `${title} (by type)`;
      case 'random':
        return `${title} (recommended)`;
      default:
        return title;
    }
  };

  return (
    <section className="mt-8 md:mt-12">
      {/* Header with enhanced mobile design */}
      <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-2">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-700 rounded-full"></div>
          <h2 className="text-lg md:text-2xl font-bold text-green-800">{getDynamicTitle()}</h2>
        </div>
        {showViewAll && viewAllLink && showcaseProducts.length >= limit && (
          <a 
            href={viewAllLink}
            className="text-green-600 hover:text-green-800 font-medium text-xs md:text-sm transition-all duration-300 flex items-center gap-1 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">More</span>
            <span className="text-sm md:text-lg transform transition-transform group-hover:translate-x-1">→</span>
          </a>
        )}
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="md:hidden">
        {/* Mobile Horizontal Scroll */}
        <div className="flex space-x-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {showcaseProducts.map((product, index) => (
            <div
              key={product._id}
              className="flex-none w-40 snap-start transform transition-all duration-500 hover:scale-105"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideInRight 0.6s ease-out forwards'
              }}
            >
              <ProductCard product={product} isMobile={true} />
            </div>
          ))}
          
          {/* Scroll indicator */}
          {showcaseProducts.length > 2 && (
            <div className="flex-none w-16 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <span className="text-green-600 text-sm">→</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile scroll dots indicator */}
        <div className="flex justify-center space-x-1 mt-3">
          {showcaseProducts.slice(0, Math.min(5, showcaseProducts.length)).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 bg-green-300 rounded-full opacity-40"
            />
          ))}
          {showcaseProducts.length > 5 && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {showcaseProducts.map((product, index) => (
          <div
            key={product._id}
            className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.8s ease-out forwards',
              opacity: 0
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Enhanced empty state */}
      {showcaseProducts.length === 0 && type !== 'manual' && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border border-green-100">
          <div className="text-4xl mb-4 animate-bounce">🌱</div>
          <p className="text-gray-600 font-medium">No products available yet.</p>
          <p className="text-green-600 text-sm mt-1">Check back soon for new arrivals!</p>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 px-4 md:px-2 bg-gray-100 rounded p-2">
          <span className="font-mono">Debug:</span> {currentSearchType} | Found: {showcaseProducts.length} | Mobile: {typeof window !== 'undefined' && window.innerWidth < 768 ? 'Yes' : 'No'}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ProductShowcase;
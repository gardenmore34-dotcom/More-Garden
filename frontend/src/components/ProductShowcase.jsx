import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '../api/productAPI';

const ProductShowcase = ({ 
  title, 
  products = [], 
  categorySlug = null, 
  type = 'manual', // 'manual', 'similar', 'category'
  limit = 8,
  excludeProductId = null,
  showViewAll = false,
  viewAllLink = null
}) => {
  const [showcaseProducts, setShowcaseProducts] = useState(products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (type === 'manual') {
        setShowcaseProducts(products);
        return;
      }

      if (!categorySlug) {
        console.warn('CategorySlug is required for category and similar types');
        setShowcaseProducts([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getProductsByCategory(categorySlug, limit + 1);
        let fetchedProducts = res.products || [];

        // Filter out the current product if needed
        if (excludeProductId) {
          fetchedProducts = fetchedProducts.filter(p => p._id !== excludeProductId);
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
  }, [type, categorySlug, limit, products, excludeProductId]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 px-2 md:px-0">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64 shadow-sm"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 px-2 md:px-0">{title}</h2>
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!showcaseProducts.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6 px-2 md:px-0">
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
        {showViewAll && viewAllLink && showcaseProducts.length >= limit && (
          <a 
            href={viewAllLink}
            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
          >
            View All 
            <span className="text-lg">→</span>
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {showcaseProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {showcaseProducts.length === 0 && type !== 'manual' && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products available in this category.</p>
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
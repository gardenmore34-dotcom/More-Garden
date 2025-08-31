import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllProducts, getProductsByCategory, getProductsByType } from '../api/productAPI';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { category, type } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        if (category) {
          res = await getProductsByCategory(category);
        } else if (type) {
          res = await getProductsByType(type);
        } else {
          res = await getAllProducts();
        }

        if (Array.isArray(res.products)) {
          setProducts(res.products);
          setFilteredProducts(res.products);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, [category, type]);

  useEffect(() => {
    let filtered = [...products];

    if (subCategory) {
      filtered = filtered.filter((product) => {
        return product.tags && product.tags.includes(subCategory);
      });
    }

    if (priceRange === 'low') {
      filtered = filtered.filter((p) => p.price <= 500);
    } else if (priceRange === 'mid') {
      filtered = filtered.filter((p) => p.price > 500 && p.price <= 1000);
    } else if (priceRange === 'high') {
      filtered = filtered.filter((p) => p.price > 1000);
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, subCategory, priceRange, sortOrder]);

  const getTitle = () => {
    if (type) {
      return `${type.replace(/-/g, ' ')} | Garden Types`;
    } else if (category) {
      return `${category.replace(/-/g, ' ')} | Garden Categories`;
    }
    return 'All Products | Garden Collection';
  };

  const getDescription = () => {
    if (type) {
      return `Browse our ${type.replace(/-/g, ' ')} collection. Quality garden products delivered to your door.`;
    } else if (category) {
      return `Shop the best ${category.replace(/-/g, ' ')} items in our garden collection.`;
    }
    return 'Explore our complete garden product collection.';
  };

  const getDisplayName = () => {
    if (type) {
      return `Type: ${type.replace(/-/g, ' ')}`;
    } else if (category) {
      return `Category: ${category.replace(/-/g, ' ')}`;
    }
    return 'All Products';
  };

  return (
    <>
      <SEO title={getTitle()} description={getDescription()} />

      <div className="min-h-screen bg-[#F3F9F3] md:px-12 py-6 md:py-8">
        {/* Filter Section */}
        <div className="mb-6 bg-white shadow rounded-xl p-3 md:p-6">
          <h1 className="text-lg md:text-2xl font-bold text-green-800 mb-3 md:mb-4">
            Showing results for:{' '}
            <span className="capitalize">{getDisplayName()}</span>
            <span className="text-xs md:text-sm text-gray-600 ml-1 md:ml-2">
              ({filteredProducts.length} products)
            </span>
          </h1>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <select
              className="border rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">All Subcategories</option>
              <option value="Potted Plant">Potted Plant</option>
              <option value="Flowering">Flowering</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Low Maintenance">Low Maintenance</option>
              <option value="Edible">Edible</option>
            </select>

            <select
              className="border rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Under ₹500</option>
              <option value="mid">₹500 - ₹1000</option>
              <option value="high">Above ₹1000</option>
            </select>

            <select
              className="border rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-base md:text-lg">
                No products found for this {type ? 'type' : 'category'}.
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-2">
                Try adjusting your filters or browse other {type ? 'types' : 'categories'}.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 md:mt-10 flex justify-center items-center space-x-1 md:space-x-2">
            <button
              className="px-2 md:px-3 py-1 rounded border text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-2 md:px-3 py-1 rounded border text-xs md:text-sm ${
                  currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-2 md:px-3 py-1 rounded border text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;

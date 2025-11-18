import React, { useEffect, useState } from "react";
import { getBulkProducts } from "../api/productAPI";
import SEO from "../components/SEO";
import BulkProductCard from "../components/BulkProductCard";

const BulkProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const BulkProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getBulkProducts();
        if (Array.isArray(res)) {
          setProducts(res);
        } else if (Array.isArray(res?.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching bulk products:", err);
        setError("Failed to load bulk products. Please try again.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <SEO
        title="Bulk Plant Purchase | Garden Products"
        description="Shop the best bulk plant deals and save big on wholesale plant purchases."
      />

      <div className="min-h-screen bg-[#F3F9F3] md:px-12 py-8">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          Bulk Plant Purchase
        </h1>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BulkProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <BulkProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                No bulk products found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </>
  );
};

export default BulkProduct;

import React, { useEffect, useState } from "react";
import { getBulkProducts } from "../api/productAPI";
import SEO from "../components/SEO";
import BulkProductCard from "../components/BulkProductCard";

const BulkProduct = () => {
  const [products, setProducts] = useState([]);
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
      const res = await getBulkProducts();
      console.log(res);
      
      if (Array.isArray(res)) {
        setProducts(res);
      } else {
        setProducts([]);
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <BulkProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No bulk products found.</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 rounded border text-sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 rounded border text-sm"
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

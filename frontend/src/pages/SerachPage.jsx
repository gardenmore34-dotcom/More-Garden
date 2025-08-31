import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '../api/productAPI';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchProducts(query);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <>
      <SEO title={`Search: ${query}`} description={`Results for "${query}"`} />

      <div className="min-h-screen bg-[#F3F9F3] md:px-12 py-8">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          Showing results for: <span className="italic">{query}</span>
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;

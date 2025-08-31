import { useEffect, useRef, useState } from 'react';
import { searchProducts } from '../api/productAPI';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const clickedDropdown = useRef(false);

  const handleSearch = debounce(async (value) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await searchProducts(value);
      setResults(res.products || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, 300);

  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Click outside to navigate
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        query &&
        !clickedDropdown.current
      ) {
        navigate(`/search?query=${encodeURIComponent(query)}`);
        setQuery('');
        setResults([]);
      }
      clickedDropdown.current = false;
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
    }
  };

  const handleSelect = (slug) => {
    clickedDropdown.current = true;
    setQuery('');
    setResults([]);
    navigate(`/product/${slug}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-md z-10 mt-1 max-h-60 overflow-y-auto">
          {results.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSelect(product.slug)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-green-100 cursor-pointer"
            >
              <img
                src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

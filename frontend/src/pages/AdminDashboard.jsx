import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProductById } from '../api/productAPI'; // Ensure deleteProductById is also imported
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed and set up

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products); // if response is { products: [...] }
      } else {
        console.warn('Unexpected API format:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductById(id);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-green-700 mb-4">Product List</h2>

      {Array.isArray(products) && products.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded p-4 shadow">
              <img
                src={product.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.images[0]?.alt || product.name}
                className="w-full h-40 object-cover rounded mb-2"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <p className="text-green-700 font-bold">₹{product.price}</p>

              <div className="flex space-x-2 mt-3">
                <button
                  className="bg-yellow-500 px-3 py-1 text-white rounded hover:bg-yellow-600"
                  onClick={() => navigate(`/edit/${product._id}`)} // Ensure you have react-router-dom installed and set up
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

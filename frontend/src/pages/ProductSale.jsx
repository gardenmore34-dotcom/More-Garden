import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllOrders } from '../api/orderAPI'; // Adjust the import path as needed
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#166534'];

const ProductSalesStats = () => {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAllOrders('all'); // Fetch all orders
        const allOrders = res.orders;

        const productMap = new Map();

        allOrders.forEach(order => {
          order.items.forEach(item => {
            const key = item._id;
            if (!productMap.has(key)) {
              productMap.set(key, {
                _id: key,
                name: item.name || 'Unnamed',
                totalQuantity: 0,
                totalRevenue: 0,
              });
            }
            const product = productMap.get(key);
            product.totalQuantity += item.quantity;
            product.totalRevenue += (item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity;
          });
        });

        const sortedStats = Array.from(productMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
        setProductStats(sortedStats);
      } catch (err) {
        console.error('Error fetching product stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredStats = productStats.filter(product =>
    (product.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">📊 Product Sales Stats</h2>

      <div className="mb-6 flex justify-between flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm w-full max-w-xs"
        />
      </div>

      {filteredStats.length === 0 ? (
        <p className="text-gray-500 text-center">No product sales data available.</p>
      ) : (
        <>
          {/* Bar Chart: Quantity Sold */}
          <div className="bg-white rounded-xl shadow p-4 mb-10">
            <h3 className="text-xl font-semibold mb-2">Top Products by Quantity Sold</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStats}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#22c55e" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart: Revenue */}
          <div className="bg-white rounded-xl shadow p-4 mb-10">
            <h3 className="text-xl font-semibold mb-2">Revenue by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStats}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#16a34a" name="Total Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Revenue Share */}
          <div className="bg-white rounded-xl shadow p-4 mb-10">
            <h3 className="text-xl font-semibold mb-4">Revenue Distribution (Pie Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredStats}
                  dataKey="totalRevenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {filteredStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Raw Stats Cards */}
          <div className="grid gap-4">
            {filteredStats.map(product => (
              <div key={product._id} className="bg-white shadow-md rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-800">{product.name}</h3>
                  <span className="text-sm text-gray-500">ID: {product._id}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>🛒 Sold: <span className="font-semibold text-green-700">{product.totalQuantity}</span></p>
                  <p>💰 Revenue: <span className="font-semibold text-green-700">₹{product.totalRevenue.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductSalesStats;
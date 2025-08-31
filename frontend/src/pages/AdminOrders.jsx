import { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orderAPI';
import { exportToCSV } from '../utils/exportToCSV';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ranges = [
  { label: 'Last 1 Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 1 Year', value: '1y' },
  { label: 'All Time', value: 'all' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState('1m');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedUsers, setExpandedUsers] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(range);
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const formatted = orders.map(order => ({
      OrderID: order._id,
      UserName: order.userId.name,
      UserID: order.userId._id,
      ProductID: order.items.map(item => item.productId).join(', '),
      ProductName: order.items.map(item => item.name || '').join(', '),
      Email: order.userId.email,
      TotalAmount: order.totalAmount,
      Status: order.status,
      PaymentMethod: order.paymentMethod || 'N/A',
      IsDelivered: order.isDelivered ? 'Yes' : 'No',
      CreatedAt: new Date(order.createdAt).toLocaleString(),
    }));
    exportToCSV(formatted, 'all_orders.csv');
  };

  useEffect(() => {
    fetchOrders();
  }, [range]);

  const filteredOrders = orders.filter(order => {
    const matchName = order.userId.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = selectedDate
      ? new Date(order.createdAt).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      : true;
    return matchName && matchDate;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const uid = order.userId._id;
    if (!acc[uid]) {
      acc[uid] = {
        user: order.userId,
        orders: [],
        total: 0,
      };
    }
    acc[uid].orders.push(order);
    acc[uid].total += Number(order.totalAmount) || 0;
    return acc;
  }, {});

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const toggleUser = userId => {
    setExpandedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const markAsDelivered = (orderId) => {
    console.log(`Marking order ${orderId} as delivered.`);
    // Add actual delivery update logic here
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-green-700">Admin Orders</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Search user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />

          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            {ranges.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {Object.keys(groupedOrders).length === 0 ? (
        <p className="text-gray-600">No orders found in this range.</p>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedOrders).map(({ user, orders, total }) => (
            <div key={user._id} className="border p-4 rounded-xl shadow bg-white">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleUser(user._id)}>
                <h3 className="text-lg font-bold text-green-800">
                  {user.name} ({user.email})
                </h3>
                {expandedUsers[user._id] ? <ChevronUp /> : <ChevronDown />}
              </div>

              {expandedUsers[user._id] && (
                <div className="mt-4 space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-green-700 font-semibold mt-1">Total: ₹{order.totalAmount}</div>
                      <div className="text-sm text-gray-700 mt-1">Payment: {order.paymentMethod || 'N/A'}</div>
                      <div className="text-sm text-gray-700">Delivery Status: {order.isDelivered ? 'Delivered' : 'Pending'}</div>
                      <div className="text-sm text-gray-700 mb-2">Order Status: {order.status}</div>

                      <ul className="list-disc ml-6 text-sm text-gray-800">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            
                            <span>{item.name || 'Unnamed'} × {item.quantity} = ₹{item.price}</span>
                          </li>
                        ))}
                      </ul>

                      {!order.isDelivered && (
                        <button
                          onClick={() => markAsDelivered(order._id)}
                          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          📦 Mark as Delivered
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="mt-2 text-right text-green-800 font-semibold">
                    🧾 Total for {user.name}: ₹{total}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-right text-xl font-bold text-green-800">
        💰 Total Revenue: ₹{totalRevenue}
      </div>
    </div>
  );
};

export default AdminOrders;

import { useEffect, useState } from 'react';
import { getUserIdFromToken } from '../api/authAPI';
import { getUserOrders } from '../api/orderAPI';
import { getProductById } from '../api/productAPI';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = getUserIdFromToken();
      try {
        const res = await getUserOrders(userId);
        const orders = res.data.orders || [];

        // Sort orders by date DESC
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Enrich items with product images
        const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
            const enrichedItems = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const product = await getProductById(item.productId || item._id);
                  return {
                    ...item,
                    name: product.name || item.name,
                    imageUrl: product.images?.[0]?.url || '',
                  };
                } catch {
                  return {
                    ...item,
                    imageUrl: '',
                  };
                }
              })
            );
            return { ...order, items: enrichedItems };
          })
        );

        setOrders(enrichedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const allItems = orders.flatMap(order =>
    order.items.map(item => ({
      ...item,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status || 'Processing',
      orderId: order._id,
    }))
  );

  const sortedItems = allItems.sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const topProductPrice = Math.max(...sortedItems.map(item => item.price || 0));

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Your Order History</h2>

      {sortedItems.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {sortedItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition"
            >
              <div className="w-full sm:w-40 h-40 bg-green-100 rounded-xl flex items-center justify-center text-4xl font-bold text-green-700 mb-4 sm:mb-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  '🪴'
                )}
              </div>

              <div className="sm:ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-green-800">{item.name}</h3>
                  {item.price === topProductPrice && (
                    <span className="bg-yellow-300 text-yellow-900 text-xs px-2 py-1 rounded-md font-semibold ml-2">
                      💰 Most Expensive
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-lg font-bold text-green-700 mt-1">₹{item.price}</p>

                <div className="mt-3 text-sm text-gray-500">
                  <p>Order Total: ₹{item.totalAmount}</p>
                  <p>Ordered on: {new Date(item.orderDate).toLocaleDateString()}</p>
                  <p>
                    Status:{' '}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                        item.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    onClick={() => alert(`Reordering ${item.name}`)}
                  >
                    🔁 Reorder
                  </button>
                  <button
                    className="text-green-700 underline"
                    onClick={() => setSelectedOrder(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-green-800 mb-4">Order Details</h3>
            <p><strong>Product:</strong> {selectedOrder.name}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Price:</strong> ₹{selectedOrder.price}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Ordered on:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

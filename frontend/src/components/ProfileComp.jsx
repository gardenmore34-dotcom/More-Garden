import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../api/authAPI'; // ✅ Make sure this exists
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

// My Profile Section
export const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');
  console.log('User ID from localStorage:', userId);
  

  useEffect(() => {
    if (userId) {
      getUserInfo(userId)
        .then(data => {
          setUser(data);
          console.log('User info fetched:', data);
        })
        .catch(err => console.error('Error fetching user info:', err));
    }
  }, [userId]);




  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-800">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal info</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <div className="flex items-center gap-3">
          <FaUser className="text-green-700" />
          <p className="text-md">
            <strong>Name:</strong> {user.name || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaEnvelope className="text-green-700" />
          <p className="text-md">
            <strong>Email:</strong> {user.email || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-green-700" />
          <p className="text-md">
            <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};




// Order History Section
export const OrderHistory = ({ orders = [] }) => {
  return (
    <div className="p-4 rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-semibold text-green-800 mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You haven't placed any orders yet.</p>
          <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
            View Products
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="border p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-green-800 font-bold">₹{order.total}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

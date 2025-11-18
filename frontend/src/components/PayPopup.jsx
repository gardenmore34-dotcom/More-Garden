import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { MdClose, MdAdd } from 'react-icons/md';
import RazorpayCheckout from './RazorpayCheckout';
import CashOnDeliveryButton from './CashOnDeliveryButton';
import { getUserAddressesAPI, updateUserAddressesAPI } from '../api/authAPI';
import { createOrder } from '../api/paymentAPI';

const PayPopup = ({ isOpen, onClose, cartItems, total, userId, orderId: propOrderId, onSuccess }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orderId, setOrderId] = useState(propOrderId || null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '', label: '', phone: '', line1: '', city: '', state: '', zip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Create order ID if not provided
  useEffect(() => {
    const generateOrderId = async () => {
      if (!propOrderId && total > 0) {
        try {
          const res = await createOrder(total);
          setOrderId(res?.orderId);
          console.log('✅ Order ID created:', res?.orderId);
        } catch (err) {
          console.error('Error creating Razorpay order:', err);
        }
      }
    };

    if (isOpen && total > 0) generateOrderId();
  }, [isOpen, propOrderId, total]);

  // 🔁 Fetch addresses
  useEffect(() => {
    if (userId && isOpen) {
      getUserAddressesAPI(userId)
        .then((res) => {
          const allAddresses = res?.addresses || res || [];
          setAddresses(allAddresses);
          setSelectedAddress(allAddresses?.[0]?._id || null);
        })
        .catch((err) => console.error('Error fetching addresses:', err));
    }
  }, [userId, isOpen]);

  const handleAddressSelect = (e) => setSelectedAddress(e.target.value);

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = async () => {
    if (!formData.name || !formData.line1 || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the new address object with a temporary ID
      const newAddress = { ...formData, _id: Date.now().toString() };
      const updated = [...addresses, newAddress];
      
      console.log('Sending to API:', updated);
      const res = await updateUserAddressesAPI(userId, updated);
      console.log('API Response:', res);
      
      // Try multiple response structures to get the updated addresses
      let updatedList = [];
      if (res?.addresses) {
        updatedList = res.addresses;
      } else if (res?.data?.addresses) {
        updatedList = res.data.addresses;
      } else if (res?.data) {
        updatedList = res.data;
      } else if (Array.isArray(res)) {
        updatedList = res;
      } else {
        // Fallback: use the addresses we sent if API doesn't return the updated list
        updatedList = updated;
      }
      
      console.log('Updated addresses list:', updatedList);
      
      // Force re-fetch addresses from API to ensure we have the latest data
      const freshRes = await getUserAddressesAPI(userId);
      const freshAddresses = freshRes?.addresses || freshRes || [];
      
      if (freshAddresses.length > addresses.length) {
        // Use fresh data if it has more addresses
        setAddresses(freshAddresses);
        // Auto-select the last address (newly added)
        const lastAddress = freshAddresses[freshAddresses.length - 1];
        setSelectedAddress(lastAddress?._id);
      } else {
        // Fallback to our updated list
        setAddresses(updatedList);
        const lastAddress = updatedList[updatedList.length - 1];
        setSelectedAddress(lastAddress?._id);
      }
      
      // Reset form and close add address section
      setFormData({ name: '', label: '', phone: '', line1: '', city: '', state: '', zip: '' });
      setShowAddAddress(false);
      
      console.log('Address added successfully');
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelAddAddress = () => {
    setFormData({ name: '', label: '', phone: '', line1: '', city: '', state: '', zip: '' });
    setShowAddAddress(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-800">Order Summary</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <MdClose size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-gray-700 border-b py-1">
                <span>{item.name} x{item.quantity}</span>
                <span>
                  ₹{(item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity}
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-2 font-semibold text-green-800">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Select Delivery Address</label>
              {!showAddAddress && (
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <MdAdd size={16} />
                  Add New Address
                </button>
              )}
            </div>

            {/* Address Dropdown */}
            {addresses.length > 0 && !showAddAddress && (
              <select
                value={selectedAddress || ''}
                onChange={handleAddressSelect}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select an address</option>
                {addresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.name} - {addr.line1}, {addr.city}, {addr.state} - {addr.zip}
                  </option>
                ))}
              </select>
            )}

            {/* No addresses message */}
            {addresses.length === 0 && !showAddAddress && (
              <div className="text-center py-4 text-gray-500">
                <p>No addresses found. Please add a delivery address.</p>
              </div>
            )}

            {/* Add Address Form */}
            {showAddAddress && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-green-800 mb-3">Add New Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Full Name *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Phone Number *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    name="label"
                    value={formData.label}
                    onChange={handleFormChange}
                    placeholder="Label (Home, Office, etc.)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 md:col-span-2"
                  />
                  <input
                    name="line1"
                    value={formData.line1}
                    onChange={handleFormChange}
                    placeholder="Address Line 1 *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 md:col-span-2"
                  />
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="City *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    placeholder="State *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleFormChange}
                    placeholder="Pincode *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddAddress}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    onClick={cancelAddAddress}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Buttons */}
          {selectedAddress && !showAddAddress && (
            <div className="space-y-3">
              <div className="w-full">
                <RazorpayCheckout
                  amount={total}
                  orderId={orderId}
                  cartItems={cartItems}
                  addressId={selectedAddress}
                  onPaymentSuccess={onSuccess}
                />
              </div>
              <div className="w-full">
                <CashOnDeliveryButton
                  userId={userId}
                  cartItems={cartItems}
                  total={total}
                  addressId={selectedAddress}
                  onSuccess={onSuccess}
                />
              </div>
            </div>
          )}

          {/* Show message if no address selected */}
          {!selectedAddress && !showAddAddress && addresses.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p>Please select a delivery address to proceed with payment.</p>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PayPopup;
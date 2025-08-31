import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { MdClose } from 'react-icons/md';
import RazorpayCheckout from './RazorpayCheckout';
import CashOnDeliveryButton from './CashOnDeliveryButton';
import { getUserAddressesAPI } from '../api/authAPI';
import { createOrder } from '../api/paymentAPI';

const PayPopup = ({ isOpen, onClose, cartItems, total, userId, orderId: propOrderId, onSuccess }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orderId, setOrderId] = useState(propOrderId || null);

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

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 z-50">
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

          {/* Address dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Delivery Address</label>
            <select
              value={selectedAddress || ''}
              onChange={handleAddressSelect}
              className="w-full border rounded px-3 py-2"
            >
              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            
              <RazorpayCheckout
                amount={total}
                orderId={orderId}
                cartItems={cartItems}
                addressId={selectedAddress}
                onPaymentSuccess={onSuccess}
              />
          
            <CashOnDeliveryButton
              userId={userId}
              cartItems={cartItems}
              total={total}
              addressId={selectedAddress}
              onSuccess={onSuccess}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PayPopup;

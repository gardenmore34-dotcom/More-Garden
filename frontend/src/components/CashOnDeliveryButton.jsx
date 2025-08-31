// components/CashOnDeliveryButton.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { placeCODOrder } from '../api/paymentAPI';

const CashOnDeliveryButton = ({ userId, cartItems, total, onSuccess }) => {
  const handleCOD = async () => {
    try {
      const res = await placeCODOrder({ userId, cartItems, total });

      if (res?.success) {
        toast.success('✅ Order placed with Cash on Delivery!');
        onSuccess?.(); // callback to clear cart or redirect
        setTimeout(() => {
          window.location.href = '/order-history';
        }, 2000);
      } else {
        toast.error(res?.message || '❌ Failed to place COD order');
      }
    } catch (err) {
      console.error('COD Error:', err);
      toast.error('❌ Error placing COD order');
    }
  };

  return (
    <button
      onClick={handleCOD}
      className="mt-3 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 w-full"
    >
      Place Order (Cash on Delivery)
    </button>
  );
};

export default CashOnDeliveryButton;

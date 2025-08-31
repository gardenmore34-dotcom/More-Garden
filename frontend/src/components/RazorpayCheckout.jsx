// src/components/RazorpayCheckout.jsx
import React from 'react';
import { verifyPayment } from '../api/paymentAPI';


const RazorpayCheckout = ({ amount, orderId, cartItems, onPaymentSuccess }) => {
  const userId = localStorage.getItem('userId');

  const loadRazorpay = () => {
    const options = {
      key: 'rzp_test_P7DRxP2GjJDRNV',
      amount: amount * 100,
      currency: 'INR',
      name: 'MORE Garden',
      description: 'Order Payment',
      order_id: orderId,
      handler: async function (response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      

        try {
          const res = await verifyPayment({
            userId,
            orderId: razorpay_order_id,
            amount,
            cartItems,
            paymentData: {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            },
          
            });

          alert('✅ Payment verified!');
          if (onPaymentSuccess) {
            onPaymentSuccess(); 
          }
            
         
      
        } catch (err) {

          console.error('Verification failed:', err);
          alert('❌ Verification failed');
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9876543210',
      },
      notes: {
        userId,
      },
      theme: {
        color: '#22c55e',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={loadRazorpay}
      className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
    >
      Pay Now ₹{amount}
    </button>
  );
};

export default RazorpayCheckout;

export const openRazorpay = ({ amount, order_id, user, onSuccess }) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add this in .env file
    amount: amount.toString(),
    currency: 'INR',
    name: 'Garden Store',
    description: 'Purchase Plants & Pots',
    image: '/logo.png', // optional logo
    order_id,
    handler: function (response) {
      // On successful payment
      onSuccess(response);
    },
    prefill: {
      name: user.name,
      email: user.email,
    },
    theme: {
      color: '#38a169',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export const closeRazorpay = () => {
  const rzp = window.Razorpay;
  if (rzp) {
    rzp.close();
  }
};
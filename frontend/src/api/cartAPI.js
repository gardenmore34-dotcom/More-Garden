// cartMerge.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';


export const addToCartAPI = async (userId, product, quantity = 1, custom = {}) => {
  const payload = {
    userId,
    productId: product._id,
    quantity,
    ...custom
  };
  const res = await axios.post(`${API_BASE_URL}/api/cart/add`, payload);
  return res.data;

};

export const updateCartItem = async (userId, productId, quantity) => {
  const payload = {
    userId,
    productId,
    quantity
  };
  const res = await axios.put(`${API_BASE_URL}/api/cart/update`, payload);
  return res.data;
};

export const getUserCart = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
  return res.data;
};

export const removeCartItem = async (userId, productId) => {
  const res = await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, {
    data: { userId }
  });
  return res.data;
};



export const mergeGuestCartWithDb = async (userId, guestCart) => {
  try {
    // 1. Get the DB cart
    const res = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
    const dbCart = await res.json();

    const dbItemsMap = {};
    dbCart.items?.forEach(item => {
      dbItemsMap[item.productId._id || item.productId] = item.quantity;
    });

    // 2. Merge logic
    for (const guestItem of guestCart) {
      const productId = guestItem.productId;
      const quantity = guestItem.quantity;

      if (dbItemsMap[productId]) {
        // Already exists in DB → update quantity
        await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: dbItemsMap[productId] + quantity })
        });
      } else {
        // Not in DB → add item
        await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity })
        });
      }
    }

    // 3. Clear guest cart (optional)
    localStorage.removeItem('cart');
    return true;

  } catch (err) {
    console.error('Error merging cart:', err);
    return false;
  }
};

// src/api/cartAPI.js


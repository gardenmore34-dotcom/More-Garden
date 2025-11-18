import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL) + "/api/order";


export const getUserOrders = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/get/${userId}`);
  return res;
};

export const getAllOrders = async (range) => {
  const res = await axios.get(`${API_BASE_URL}/admin/orders`, {
    params: { range },
  });
  return res.data;
};
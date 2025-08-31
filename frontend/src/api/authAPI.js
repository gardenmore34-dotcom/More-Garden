import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/auth';

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_BASE}/login`, credentials);
  return res.data;
};

export const registerUser = async (userInfo) => {
  const res = await axios.post(`${API_BASE}/register`, userInfo);
  return res.data;
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode payload
    return payload.userId || payload.id || payload._id || null; // depends on your backend
  } catch (e) {
    console.error("Failed to parse token:", e);
    return null;
  }
}


export const getUserInfo = async (userId) => {

  const res = await axios.get(`${API_BASE}/info/${userId}`);
  return res.data;
};

export const getUserAddressesAPI = async (userId) => {
  const res = await axios.get(`${API_BASE}/${userId}/addresses`);
  return res.data;
};

export const updateUserAddressesAPI = async (userId, addresses) => {
  const res = await axios.put(`${API_BASE}/${userId}/addresses`, { addresses });
  return res.data;
};
// api/categoryAPI.js
import axios from 'axios';


const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL ) + "/api/categories";



export const getAllCategories = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

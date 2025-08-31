// api/categoryAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/categories/';


export const getAllCategories = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

// src/api/productAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/products';

export const createProduct = async (formData) => {
  console.log('Creating product with data:', formData);
  
  const res = await axios.post(`${API_BASE_URL}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res;
};

export const getProductBySlug = async (slug) => {
  const res = await axios.get(`${API_BASE_URL}/slug/${slug}`);
  return res.data;
};

export const fetchPaginatedProducts = async (params) => {
  const response = await axios.get(API_BASE_URL, { params });
  return response.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const updateProduct = async (id, data) => {
  console.log('Updating product with ID:', id, 'and data:', data);
  const res = await axios.put(`${API_BASE_URL}/update/${id}`, data);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await axios.get(`${API_BASE_URL}?search=${encodeURIComponent(query)}`);
  return res.data;
};

export const getAllProducts = async () => {
  const url = `${API_BASE_URL}?limit=1000`;
  console.log('🔍 Calling getAllProducts URL:', url);
  
  try {
    const response = await axios.get(url);
    console.log('📡 Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ getAllProducts error:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug) => {
  const url = `${API_BASE_URL}?category=${categorySlug}`;
  console.log('🔍 Calling getProductsByCategory URL:', url);
  
  try {
    const response = await axios.get(url);
    console.log('📡 Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ getProductsByCategory error:', error);
    throw error;
  }
};

export const deleteProductById = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const updateProductById = async (id, updatedData) => {
  const res = await axios.put(`${API_BASE_URL}/update/${id}`, updatedData);
  return res.data;
};

export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_BASE_URL}/id/${id}`);
  return data;
};

export const getFeaturedProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/featured`);
  return res.data;
};

export const getBulkProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/bulk`);
  return res.data;
};

export const getProductsByType = async (typeSlug) => {
  const url = `${API_BASE_URL}?type=${typeSlug}`;
  console.log('🔍 Calling getProductsByType URL:', url);
  
  try {
    const response = await axios.get(url);
    console.log('📡 Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ getProductsByType error:', error);
    throw error;
  }
};

// Add to your productAPI.js
export const getSimilarProducts = async (productSlug, limit = 8) => {
  const response = await fetch(`${API_BASE_URL}/similar/${productSlug}?limit=${limit}`);
  return response.json();
};


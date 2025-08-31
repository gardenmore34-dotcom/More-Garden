import axios from "axios";

const API_BASE_URL = 'http://localhost:4000/api/testimonials';

const getFeaturedTestimonials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/featured`);
    return response.data;
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    throw error;
  }
};

const createTestimonial = async (testimonialData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, testimonialData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};  

const getAllTestimonials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getall`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    throw error;
  }
};  
const updateTestimonial = async (id, testimonialData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, testimonialData,
        {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};  

const deleteTestimonial = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${id}`);
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

export { getFeaturedTestimonials, createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial };

// controllers/testimonialController.js
import { log } from 'console';
import Testimonial from '../models/Testimonials.js';
import  upload  from '../middleware/cloudinaryStorage.js';

export const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};
 // adjust the import if needed

// controllers/testimonialController.js

export const createTestimonial = async (req, res) => {
  try {
    const { name, review, rating, comment, featured } = req.body;

    

    const testimonial = new Testimonial({
      name,
      review,
      rating,
      comment,
      featured: featured === 'true', // Convert string to boolean
      image: req.file?.path || '', // Cloudinary provides the URL in `file.path`
    });

    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to create testimonial:', err);
    res.status(400).json({ message: 'Failed to create testimonial' });
  }
};



// Get all testimonials (admin)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed' });
  }
};
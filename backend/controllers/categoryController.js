import { log } from 'console';
import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    console.log('Received category data:', req.body);
    console.log('Received file:', req.file);
    
    const { name } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Category image is required' });
    }
    
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const image = req.file.path; // From Cloudinary
    
    const category = await Category.create({ name, slug, image });
    res.status(201).json(category);
  } catch (err) {
    console.error('Category creation error:', err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category with this name or slug already exists' });
    }
    
    res.status(500).json({ message: 'Category creation failed', error: err.message });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
};

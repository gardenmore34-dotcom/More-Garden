// controllers/productController.js
import { Product } from '../models/Product.js';
import { validationResult } from 'express-validator';
import Category from "../models/Category.js";
import slugify from "slugify";

// Create Product Controller
export const createProduct = async (req, res) => {
  try {
    console.log('📝 Creating product with data:', req.body);
    console.log('📸 Files received:', req.files);

    const {
      name,
      slug,
      description,
      categories,
      price,
      discountPrice,
      quantity,
      rating,
      inStock,
      featured,
      bulk,
      tags,
      type
    } = req.body;

    // Validate required fields
    if (!name || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and type are required fields'
      });
    }

    // Parse JSON strings from frontend
    let parsedCategories = [];
    let parsedTags = [];

    try {
      parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories || [];
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
      console.log('🏷️ Parsed categories:', parsedCategories);
      console.log('🏷️ Parsed tags:', parsedTags);
    } catch (error) {
      console.error('❌ JSON parsing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in categories or tags'
      });
    }

    // Validate category names exist and get their ObjectIds
    const categoryIds = [];
    if (parsedCategories.length > 0) {
      for (const categoryName of parsedCategories) {
        console.log(`🔍 Looking for category: '${categoryName}'`);
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
          console.log(`❌ Category '${categoryName}' not found in database`);
          // Log all available categories for debugging
          const allCategories = await Category.find({}, 'name');
          console.log('📋 Available categories:', allCategories.map(c => c.name));
          return res.status(400).json({
            success: false,
            message: `Category '${categoryName}' does not exist`,
            availableCategories: allCategories.map(c => c.name)
          });
        }
        console.log(`✅ Found category: ${category.name} with ID: ${category._id}`);
        categoryIds.push(category._id);
      }
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          url: file.path, // Cloudinary URL
          alt: file.originalname || name
        });
      });
    }

    // Create product data object
    const productData = {
      name: name.trim(),
      slug: slug?.toLowerCase() || slugify(name, { lower: true, strict: true }),
      description: description.trim(),
      type,
      categories: categoryIds,
      tags: parsedTags,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      quantity: quantity ? Number(quantity) : 0,
      rating: rating ? Number(rating) : 0,
      inStock: inStock === 'true' || inStock === true,
      featured: featured === 'true' || featured === true,
      bulk: bulk === 'true' || bulk === true,
      images
    };

    console.log('📦 Product data to save:', productData);

    // Validate enum values
    const validTypes = ['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'];
    if (!validTypes.includes(productData.type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid product type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    // Validate numeric values
    if (productData.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    if (productData.rating < 0 || productData.rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    // Create the product
    const product = new Product(productData);
    const savedProduct = await product.save();

    // Populate categories for response
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('categories', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);

    // Handle duplicate key error (slug already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        details: error.errors // Include full error details for debugging
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// @desc    Get all products (with filter, search, sort)
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;

    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};

    // Updated category filter logic
    let categoryFilter = {};
    if (req.query.category) {
      try {
        // First, find the category by slug to get its ObjectId
        const category = await Category.findOne({ slug: req.query.category });
        
        if (category) {
          // Use the ObjectId to filter products
          categoryFilter = { categories: category._id };
          console.log(`🔍 Found category "${category.name}" with ID: ${category._id}`);
        } else {
          console.log(`❌ No category found with slug: ${req.query.category}`);
          // Return empty result if category doesn't exist
          return res.status(200).json({
            products: [],
            page,
            totalPages: 0,
            totalProducts: 0,
          });
        }
      } catch (error) {
        console.error('Error finding category:', error);
        return res.status(400).json({ message: 'Invalid category', error });
      }
    }

    const priceFilter = req.query.minPrice && req.query.maxPrice
      ? { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } }
      : {};
    
    let typeFilter = {};
    if (req.query.type) {
      typeFilter = { type: { $regex: new RegExp(`^${req.query.type}$`, 'i') } };
      console.log(`🔍 Filtering by type: ${req.query.type}`);
    }

    const filter = { ...keyword, ...categoryFilter, ...priceFilter, ...typeFilter };

    console.log('🔍 Final filter object:', filter);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('categories', 'name slug')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error('getAllProducts error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// ✅ @desc    Get single product by ID
// ✅ @route   GET /api/products/id/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// ✅ @desc    Update product
// ✅ @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      tags,
      price,
      discountPrice,
      inStock,
      quantity,
      featured,
      rating,
    } = req.body;

    const updateFields = {
      name,
      slug,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      price,
      discountPrice,
      inStock,
      quantity,
      featured,
      rating,
    };

    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(file => ({
        url: file.path,
        alt: file.originalname,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await Product.find({
      name: { $regex: query, $options: 'i' } // case-insensitive match
    }).select('name slug price images');

    res.status(200).json({ products });
  } catch (err) {
    console.error('❌ Product search error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ featured: true });

    // Shuffle and pick top 8
    const shuffled = featured.sort(() => 0.5 - Math.random()).slice(0, 8);
    res.status(200).json(shuffled);
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBulkProducts = async (req, res) => {
  try {
    const bulkProducts = await Product.find({ bulk: true });

    res.status(200).json(bulkProducts);
  } catch (err) {
    console.error('Failed to fetch bulk products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this function to your productController.js

// @desc    Get similar products based on categories
// @route   GET /api/products/similar/:slug
export const getSimilarProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit) || 8;

    // Find the current product by slug
    const currentProduct = await Product.findOne({ slug })
      .populate('categories', 'name slug');

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the category IDs from the current product
    const categoryIds = currentProduct.categories.map(cat => cat._id);

    if (categoryIds.length === 0) {
      return res.status(200).json({ products: [] });
    }

    // Find products that share at least one category, excluding the current product
    const similarProducts = await Product.find({
      _id: { $ne: currentProduct._id }, // Exclude current product
      categories: { $in: categoryIds }, // Match any of the categories
    })
      .populate('categories', 'name slug')
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 }); // Sort by rating first, then newest

    console.log(`Found ${similarProducts.length} similar products for "${currentProduct.name}"`);

    res.status(200).json({
      products: similarProducts,
      currentProduct: currentProduct.name,
      totalSimilar: similarProducts.length
    });

  } catch (error) {
    console.error('getSimilarProducts error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Alternative: Get products by specific category slug
// @desc    Get products by category slug
// @route   GET /api/products/category/:categorySlug
export const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find products in this category
    const products = await Product.find({ categories: category._id })
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ categories: category._id });

    console.log(`Found ${products.length} products for category "${category.name}"`);

    res.status(200).json({
      products,
      category: {
        name: category.name,
        slug: category.slug
      },
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });

  } catch (error) {
    console.error('getProductsByCategory error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
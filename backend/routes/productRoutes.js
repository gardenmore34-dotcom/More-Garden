import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBulkProducts,
  getSimilarProducts,
  getProductsByCategory
} from '../controllers/productController.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import upload from '../middleware/cloudinaryStorage.js';
import  {validate} from '../utils/validate.js';
import { productValidationRules } from '../validators/productValidator.js';

const router = express.Router();

router.post('/test', (req, res) => {
  console.log('🚀 Test route hit!');
  res.send('It works');
});

router.post(
  "/add",
  upload.array("images", 5),
  (req, res, next) => {
    console.log("📥 Route /add hit!");
    console.log("➡️ Incoming req.body:", req.body);
    console.log("📸 Incoming req.files:", req.files);
    next();
  },
  validate,
  createProduct
);

// Main products route - supports category filtering via query params
router.get('/', getAllProducts);

// Optional: Dedicated category route for cleaner URLs
router.get('/category/:categorySlug', (req, res) => {
  // Add categorySlug to query params and pass to getAllProducts
  req.query.category = req.params.categorySlug;
  getAllProducts(req, res);
});

router.get('/type/:typeSlug', (req, res) => {
  // Add typeSlug to query params and pass to getAllProducts
  req.query.type = req.params.typeSlug;
  getAllProducts(req, res);
});

router.put('/update/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/slug/:slug', getProductBySlug);
router.get('/id/:id', getProductById);
router.get('/search', searchProducts);
router.get("/bulk", getBulkProducts);
router.get('/featured', getFeaturedProducts);
router.get('/similar/:slug', getSimilarProducts);
router.get('/category/:categorySlug', getProductsByCategory);

export default router;
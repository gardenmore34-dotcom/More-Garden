// routes/cartRoutes.js
import express from 'express';
import {
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getUserCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear/:userId', clearCart);

export default router;

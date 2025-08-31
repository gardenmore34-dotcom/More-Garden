// controllers/cartController.js
import Cart from '../models/Cart.js';

export const getUserCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  res.json(cart || { items: [] });
};

export const addToCart = async (req, res) => {
  const { userId } = req.body;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) item.quantity += quantity;
    else cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

export const updateCartItem = async (req, res) => {

  const { productId, quantity, userId } = req.body;

  const cart = await Cart.findOne({ userId });
  const item = cart.items.find(i => i.productId.toString() === productId);
  if (item) item.quantity = quantity;
  await cart.save();

  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const {  productId } = req.params;
  const { userId } = req.body;

  const cart = await Cart.findOne({ userId });
  cart.items = cart.items.filter(i => i.productId.toString() !== productId);
  await cart.save();

  res.json(cart);
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Cart.deleteOne({ userId }); // if cart is stored as 1 doc per user
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('❌ Error clearing cart:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
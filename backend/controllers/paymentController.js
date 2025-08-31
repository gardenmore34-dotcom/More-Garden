import Razorpay from 'razorpay';
import Payment from '../models/paymentModel.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import { Product } from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100, // convert to paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log('🧾 Razorpay Order Created:', order);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Server error in order creation' });
  }
};

export const verifyAndSavePayment = async (req, res) => {
  try {
    const { userId, orderId, paymentData, amount, cartItems, paymentMethod } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData || {};

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items required' });
    }

    // Validate and verify Razorpay data for online payments only
    if (paymentMethod === 'online') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing Razorpay payment details' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', razorpay.key_secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Signature mismatch' });
      }

      // Save payment record for online orders
      const payment = new Payment({
        userId,
        orderId,
        paymentId: razorpay_payment_id,
        amount,
        status: 'Success',
      });
      await payment.save();
    }

    // Enrich cartItems with product and user data
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        const user = await User.findById(userId);
        if (!product) return null;

        return {
          productId: product._id,
          userId: user._id,
          userName: user.name,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images?.[0]?.url || '',
          quantity: item.quantity,
        };
      })
    );

    const validItems = enrichedItems.filter(Boolean);
    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    // Create order
    const order = new Order({
      userId,
      userName: validItems[0].userName,
      items: validItems,
      totalAmount: amount,
      paymentMethod: 'online',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'completed',
    });
    await order.save();

    // Clear cart
    await Cart.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });

    res.status(200).json({ message: 'Order saved successfully' });
  } catch (err) {
    console.error('💥 Error in verifyAndSavePayment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const placeCODOrder = async (req, res) => {
  try {
    const { userId, cartItems, totalAmount } = req.body;
    console.log('🚀 [1] placeCODOrder called with:', { userId, cartItems, totalAmount });
    

    if (!userId || !cartItems || cartItems.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Enrich cart items with product info
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        if (!product) return null;

        return {
          productId: product._id,
          userId: user._id,
          userName: user.name,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.images?.[0]?.url || '',
          quantity: item.quantity,
        };
      })
    );

    const validItems = enrichedItems.filter(Boolean);
    if (validItems.length === 0) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    const order = new Order({
      userId,
      userName: user.name,
      items: validItems,
      totalAmount,
      paymentMethod: 'COD',
      status: 'pending',
    });
  

    await order.save();
    
    await Cart.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });

    res.status(201).json({ message: 'COD Order placed successfully', order });
  } catch (err) {
    console.error('💥 Error placing COD order:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

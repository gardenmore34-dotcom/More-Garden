import express from 'express';
import { getUserOrders, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

router.get('/get/:userId', getUserOrders);
router.get('/admin/orders', getAllOrders);

export default router;

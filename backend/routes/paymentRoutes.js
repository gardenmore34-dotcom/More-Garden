import express from 'express';
import { createOrder, verifyAndSavePayment,placeCODOrder } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyAndSavePayment);
router.post('/place-cod-order', placeCODOrder);

export default router;

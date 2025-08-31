// routes/testimonialRoutes.js
import express from 'express';
import { getFeaturedTestimonials,
    createTestimonial,
    getAllTestimonials,
    updateTestimonial,
    deleteTestimonial
 } from '../controllers/testimonialController.js';
import upload from '../middleware/cloudinaryStorage.js';

const router = express.Router();

router.get('/featured', getFeaturedTestimonials);
router.post('/create', upload.single('image'), createTestimonial);
router.get('/getall', getAllTestimonials);
router.put('/update/:id', updateTestimonial);
router.delete('/delete/:id', deleteTestimonial);


export default router;

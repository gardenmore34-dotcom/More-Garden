// models/Testimonial.js
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, 
    required: true
 },
  comment: { type: String, 
    required: true
 },
  rating: { type: Number, 
    default: 5
 },
  image: { type: String ,
    default: ''  
  }, 
  featured: { type: Boolean, 
    default: false
  },
  createdAt: { type: Date, 
    default: Date.now },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;

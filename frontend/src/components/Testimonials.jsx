import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFeaturedTestimonials } from '../api/testimonialAPI';

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getFeaturedTestimonials()
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setTestimonials(shuffled.slice(0, 8));
      })
      .catch((err) => {
        console.error('Error fetching testimonials:', err);
      });
  }, []);

  return (
    <section className="py-16 bg-[#F0FDF4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-green-800 mb-12">
          Loved by our Plant People
        </h2>

        {/* Desktop - Horizontal Scroll */}
        <div className="hidden md:flex gap-6 overflow-x-auto scrollbar-hide px-2">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[320px] bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex-shrink-0"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <img
                  src={t.image || '/placeholder-avatar.png'}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500 mb-3"
                />
                <div className="font-semibold text-green-800">{t.name}</div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mt-3 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 mx-0.5 ${
                      i < t.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill={i < t.rating ? '#facc15' : 'none'}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 italic text-sm line-clamp-5">
                "{t.comment}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile - Swipeable Stacked Testimonials */}
        {/* Mobile - Carousel, one card per slide */}
<div className="md:hidden">
  <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
    {testimonials.map((t, idx) => (
      <motion.div
        key={`mobile-${idx}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="min-w-full snap-center px-4"
      >
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          {/* Layout - Horizontal card */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <img
              src={t.image || '/placeholder-avatar.png'}
              alt={t.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-500 flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-green-800 text-sm">{t.name}</div>
                {/* Rating */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill={i < t.rating ? '#facc15' : 'none'}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-600 italic text-xs leading-relaxed">
                "{t.comment}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>

      </div>
    </section>
  );
};

export default TestimonialSection;

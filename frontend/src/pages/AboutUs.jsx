import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSeedling, FaSmile } from 'react-icons/fa';
import SEO from '../components/SEO'; // Assuming you have a SEO component

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const AboutUs = () => {
  return (
    <>
      <SEO title="About Us" description="Learn about MyGarden's mission and values." />
    
    <div className="bg-[#FDFBF7] text-gray-800">
        

      {/* Mission */}
      <motion.section
        className="py-16 px-4 text-center bg-green-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-4xl font-bold text-green-700 mb-4">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-lg">
          At MyGarden, we’re passionate about bringing nature closer to your home. Our goal is to make
          gardening accessible, joyful, and sustainable for everyone.
        </p>
      </motion.section>

      {/* Who We Are */}
      <section className="py-16 px-6 bg-white">
        <motion.h2
          className="text-3xl font-bold text-center text-green-700 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Who We Are
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[FaLeaf, FaSeedling, FaSmile].map((Icon, i) => (
            <motion.div
              key={i}
              className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex justify-center">
                <Icon className="text-4xl text-green-600 mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-center mt-2 mb-2">
                {['Nature Lovers', 'Eco Warriors', 'Customer First'][i]}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {
                  [
                    'We are a team of plant enthusiasts, here to help you build your perfect green space.',
                    'Our products are chosen with sustainability and eco-consciousness in mind.',
                    'We’re committed to making your gardening journey a delightful experience.',
                  ][i]
                }
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-100 via-green-200 to-green-100">
        <motion.h2
          className="text-3xl font-bold text-center text-green-800 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Why Choose Us
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            'Wide Variety of Plants',
            'Eco-Friendly Products',
            'Expert Gardening Tips',
            'Fast & Safe Delivery',
          ].map((text, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-lg shadow text-center font-medium text-green-700 border border-green-200"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <motion.section
        className="py-16 px-6 bg-green-700 text-white text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Be part of a family that celebrates green living. Connect with fellow plant lovers, get expert tips,
          and share your own gardening journey.
        </p>
        <button className="bg-white text-green-700 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition">
          Join Now
        </button>
      </motion.section>
    </div>
    </>
  );
};

export default AboutUs;

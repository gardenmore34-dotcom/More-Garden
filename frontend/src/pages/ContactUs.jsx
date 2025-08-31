import React from 'react';
import { motion } from 'framer-motion';
import contactImage from '../assets/Home3.jpeg'; // your designated contact image
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

import { Helmet } from 'react-helmet';

<Helmet>
  <title>Contact Us | MyGarden</title>
  <meta name="description" content="Reach out to MyGarden for any garden-related inquiries, support, or collaborations." />
</Helmet>


const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F3F9F3] flex flex-col items-center justify-center py-12 px-4 md:px-16">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-green-800 mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Get in Touch With Us
      </motion.h1>

      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Image */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img
            src={contactImage}
            alt="Contact"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <motion.form
            className="space-y-6"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            className="mt-10 space-y-4 text-sm text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-green-600" />
              <span>Pune, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-green-600" />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-green-600" />
              <span>support@mygarden.com</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

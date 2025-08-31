import React, { useState } from 'react';
import { motion } from 'framer-motion';


import HeroCarousel from '../components/HeroCarousel';
import CategoryCardsSection from '../components/CategoryCardsSection';
import NurseryIntroSection from '../components/NurseryIntroSection';
import BestsellersSection from '../components/BestSellerSection';
import Testimonials from '../components/Testimonials';
import LatestArticles from '../components/LatestArticles';

import SEO from '../components/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const HomePage = () => {
  const [categoryFilter, setCategoryFilter] = useState('');

  return (
    <>
      <SEO title="Home" description="Welcome to MyGarden, your go-to place for all things gardening." />
   
    <div>
      <HeroCarousel />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <CategoryCardsSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <NurseryIntroSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <BestsellersSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Testimonials />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <LatestArticles />
      </motion.div>

      
    </div>
     </>
  );
};

export default HomePage;

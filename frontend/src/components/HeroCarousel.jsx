import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import home0 from '../assets/Home0.png';
import home3 from '../assets/Home0desk.png';
import home1 from '../assets/Home1.png';
import home2 from '../assets/Home2.png';
import about from '../assets/Home3.jpeg';
import home4 from '../assets/Home4.png';
import home5 from '../assets/Home5.png';

const heroImages = {
  '/': {
    mobile: [home0, home4],
    desktop: [home3, home1, home2, home5]
  },
  '/contact': {
    mobile: [home0],
    desktop: [home3]
  }
};

const HeroCarousel = () => {
  const { pathname } = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slideRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust this breakpoint as needed
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Get images based on device type
  const getImages = () => {
    const pageImages = heroImages[pathname];
    if (!pageImages) return [];
    
    return isMobile ? pageImages.mobile : pageImages.desktop;
  };

  const images = getImages();

  // Reset slide when images change (e.g., when switching between mobile/desktop)
  useEffect(() => {
    setCurrentSlide(0);
  }, [isMobile, pathname]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Scroll to current slide
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.scrollTo({
        left: currentSlide * slideRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [currentSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const title =
    pathname === '/' ? 'Welcome to MyGarden' :
    pathname === '/about' ? 'About Us' :
    pathname === '/contact' ? 'Contact Us' :
    pathname.includes('/category/plants') ? 'Plants Collection' :
    pathname.includes('/category/seeds') ? 'Seeds Collection' :
    'Explore';

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {/* Slide Container */}
      <div
        ref={slideRef}
        className="flex transition-all duration-3000 ease-in-out w-full h-full overflow-hidden"
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-70"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-70"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
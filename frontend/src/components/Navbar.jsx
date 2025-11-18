import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSearch from './ProductSearch';
import { UserCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { IconPlant, IconSeeds, IconWateringCan, IconFertilizerSack, IconPot, IconBlog, IconAbout, IconBulk } from './ui/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInitial } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const body = document.body;

    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
    } else {
      const scrollY = parseInt(body.dataset.scrollY || '0', 10);
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      delete body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }

    return () => {
      const scrollY = parseInt(body.dataset.scrollY || '0', 10);
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      delete body.dataset.scrollY;
      if (isMobileMenuOpen) window.scrollTo(0, scrollY);
    };
  }, [isMobileMenuOpen]);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    const formattedCategory = category.toLowerCase();
    navigate(`/type/${formattedCategory}`);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // SVG icons for mobile menu only
  const categoryIconMap = {
    Plants: <IconPlant className="w-5 h-5 text-green-700" />,
    Seeds: <IconSeeds className="w-5 h-5 text-yellow-600" />,
    Tools: <IconWateringCan className="w-5 h-5 text-green-600" />,
    Fertilizers: <IconFertilizerSack className="w-5 h-5 text-amber-700" />,
    Pots: <IconPot className="w-5 h-5 text-orange-700" />,
  };

  return (
    <>
      {/* Sticky Header */}
      <nav className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 bg-[#FDFBF7]/95 backdrop-blur-sm shadow-md border-b border-green-100">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-green-700 cursor-pointer flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
          onClick={() => navigate('/')}
        >
          <span className="text-3xl">🌿</span>
          <span>MoreGarden</span>
        </div>

        {/* Desktop Navigation - Clean text with underlines */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'].map((category) => (
            <li
              key={category}
              className="hover:text-green-700 cursor-pointer transition-all duration-300 relative group"
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category}</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
            </li>
          ))}
          <li className="hover:text-green-700 cursor-pointer transition-all duration-300 relative group" onClick={() => navigate('/blog')}>
            <span>Blog</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
          </li>
          <li className="hover:text-green-700 cursor-pointer transition-all duration-300 relative group" onClick={() => navigate('/about')}>
            <span>About Us</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
          </li>
          <li className="hover:text-green-700 cursor-pointer transition-all duration-300 relative group" onClick={() => navigate('/bulk')}>
            <span>Bulk Products</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
          </li>
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <ProductSearch />

          {/* Profile Icon */}
          <div
            onClick={handleProfileClick}
            className="cursor-pointer group relative"
            title={isLoggedIn ? 'Profile' : 'Login'}
          >
            {isLoggedIn ? (
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-md transition hover:scale-105">
                {userInitial || <UserCircle className="w-6 h-6" />}
              </div>
            ) : (
              <UserCircle className="w-7 h-7 text-green-700 hover:text-green-900 transition" />
            )}
          </div>

          {/* Cart Icon */}
          <span
            className="cursor-pointer text-xl hover:scale-105 transition"
            onClick={() => navigate('/cart')}
            title="Cart"
          >
            🛒
          </span>
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Profile Icon */}
          <div
            onClick={handleProfileClick}
            className="cursor-pointer p-1 rounded-full hover:bg-green-50 active:bg-green-100 transition-colors duration-200"
            title={isLoggedIn ? 'Profile' : 'Login'}
          >
            {isLoggedIn ? (
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-md">
                {userInitial || <UserCircle className="w-5 h-5" />}
              </div>
            ) : (
              <UserCircle className="w-7 h-7 text-green-700" />
            )}
          </div>

          {/* Mobile Cart Icon */}
          <button
            className="cursor-pointer text-xl p-1 rounded-full hover:bg-green-50 active:bg-green-100 transition-colors duration-200"
            onClick={() => navigate('/cart')}
            title="Cart"
          >
            🛒
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-green-700 hover:bg-green-50 active:bg-green-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Non-sticky Search Bar - Mobile Only */}
      <div className="md:hidden px-6 py-3 bg-[#FDFBF7]/90 backdrop-blur-sm shadow-md -mb-1">
        <ProductSearch />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out overscroll-contain ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
        
        {/* Slide-in Menu */}
        <div
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-sm bg-[#FDFBF7]/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto overscroll-contain ${
            isMobileMenuOpen 
              ? 'translate-x-0' 
              : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-green-100 bg-green-50/50">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌿</span>
              <span className="text-lg font-bold text-green-700">MoreGarden</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links - Uses SVG icons */}
          <div className="flex-1 overflow-y-auto">
            {/* Categories - SVG icons */}
            <div className="p-6 space-y-1">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-4 px-3">Shop Categories</h3>
              {['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'].map((category) => (
                <button
                  key={category}
                  className="group w-full text-left px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 active:bg-green-100 transition-all duration-200 font-medium rounded-xl border border-transparent hover:border-green-100 flex items-center space-x-3"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{categoryIconMap[category]}</span>
                  <span>{category}</span>
                </button>
              ))}
            </div>

            {/* Other Links - SVG icons */}
            <div className="px-6 pb-6 space-y-1">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-4 px-3 pt-4 border-t border-green-100">More</h3>
              {[
                { label: 'Blog', path: '/blog', Icon: IconBlog },
                { label: 'About Us', path: '/about', Icon: IconAbout },
                { label: 'Bulk Products', path: '/bulk', Icon: IconBulk }
              ].map((item) => (
                <button
                  key={item.label}
                  className="group w-full text-left px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 active:bg-green-100 transition-all duration-200 font-medium rounded-xl border border-transparent hover:border-green-100 flex items-center space-x-3"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.Icon className="w-5 h-5 text-green-700" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="p-6 border-t border-green-100 bg-green-50/30">
              <div className="text-center text-sm text-gray-500">
                <p className="font-medium text-green-700 mb-1 flex items-center justify-center">
                  <span className="mr-2">🌱</span>
                  Happy Gardening!
                </p>
                <p>Find everything for your garden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

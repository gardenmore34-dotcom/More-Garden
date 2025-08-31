import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSearch from './ProductSearch';
import { UserCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInitial } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  const handleCategoryClick = (category) => {
    const formattedCategory = category.toLowerCase();
    navigate(`/type/${formattedCategory}`);
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-[#FDFBF7] shadow-md relative">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-green-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          🌿 MoreGarden
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'].map((category) => (
            <li
              key={category}
              className="hover:text-green-700 cursor-pointer transition"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
          <li className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/blog')}>
            Blog
          </li>
          <li className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/about')}>
            About Us
          </li>
          <li className="hover:text-green-700 cursor-pointer" onClick={() => navigate('/bulk')}>
            Bulk Products
          </li>
        </ul>

        {/* Desktop Right Side - Search, Profile, Cart */}
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

        {/* Mobile Right Side - Profile, Cart, Hamburger */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Mobile Profile Icon */}
          <div
            onClick={handleProfileClick}
            className="cursor-pointer"
            title={isLoggedIn ? 'Profile' : 'Login'}
          >
            {isLoggedIn ? (
              <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-md">
                {userInitial || <UserCircle className="w-5 h-5" />}
              </div>
            ) : (
              <UserCircle className="w-6 h-6 text-green-700" />
            )}
          </div>

          {/* Mobile Cart Icon */}
          <span
            className="cursor-pointer text-lg"
            onClick={() => navigate('/cart')}
            title="Cart"
          >
            🛒
          </span>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-green-700 hover:text-green-900 transition-colors"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div
            className="fixed top-0 right-0 h-full w-80 bg-[#FDFBF7] shadow-2xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <span className="text-lg font-bold text-green-700">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-1 text-green-700 hover:text-green-900"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-6 border-b border-gray-200">
              <ProductSearch />
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-6 space-y-4">
              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Categories</h3>
                {['Plants', 'Seeds', 'Tools', 'Fertilizers', 'Pots'].map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-700 transition font-medium"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Other Links */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-700 transition font-medium"
                  onClick={() => handleNavigation('/blog')}
                >
                  Blog
                </button>
                <button
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-700 transition font-medium"
                  onClick={() => handleNavigation('/about')}
                >
                  About Us
                </button>
                <button
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-700 transition font-medium"
                  onClick={() => handleNavigation('/bulk')}
                >
                  Bulk Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
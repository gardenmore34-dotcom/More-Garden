import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (section) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">Our Story</a></li>
              <li><a href="/contact" className="hover:text-green-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Locate Stores</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Garden Services</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">Track Order</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Refund Policy</a></li>
            </ul>
          </div>

          {/* Offers & Rewards */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Offers & Rewards</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">Rewards Club</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Coupons</a></li>
            </ul>
          </div>

          {/* Contact Info & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Information</h3>
            <p className="text-sm leading-relaxed mb-2">
              <strong>Address:</strong><br />
              <a
                href="https://www.google.com/maps?q=Manjari+Farm,+Opp+Shewalewadi+Jakat+Naka,+Pune-Solapur+Road,+Manjari,+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Manjari Farm, Opp. Shewalewadi Jakat Naka,<br />
                Pune-Solapur Road, Manjari, Pune, Maharashtra.
              </a>
            </p>
            <p className="text-sm mb-1">
              <strong>Phone:</strong>{' '}
              <a href="tel:+919767057658" className="hover:text-green-400 transition">
                +91 9767057658
              </a>
            </p>
            <p className="text-sm mb-4">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:pritam@moregardensindia.com"
                className="text-green-400 hover:underline"
              >
                pritam@moregardensindia.com
              </a>
            </p>

            <h3 className="text-lg font-semibold mb-2 text-white">Connect With Us</h3>
            <div className="flex space-x-4 mt-2 text-lg">
              <a href="#" className="hover:text-green-400 transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-green-400 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-green-400 transition"><FaLinkedinIn /></a>
              <a href="#" className="hover:text-green-400 transition"><FaYoutube /></a>
              <a
                href="https://wa.me/919767057658"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Dropdown Style */}
        <div className="md:hidden space-y-4">
          
          {/* About Us Dropdown */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleDropdown('about')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">About Us</h3>
              {openDropdowns.about ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openDropdowns.about && (
              <ul className="mt-3 space-y-2 text-sm pl-4">
                <li><a href="#" className="hover:text-green-400 transition">Our Story</a></li>
                <li><a href="/contact" className="hover:text-green-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Locate Stores</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Garden Services</a></li>
              </ul>
            )}
          </div>

          {/* Customer Care Dropdown */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleDropdown('care')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">Customer Care</h3>
              {openDropdowns.care ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openDropdowns.care && (
              <ul className="mt-3 space-y-2 text-sm pl-4">
                <li><a href="#" className="hover:text-green-400 transition">Track Order</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Refund Policy</a></li>
              </ul>
            )}
          </div>

          {/* Offers & Rewards Dropdown */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleDropdown('offers')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">Offers & Rewards</h3>
              {openDropdowns.offers ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openDropdowns.offers && (
              <ul className="mt-3 space-y-2 text-sm pl-4">
                <li><a href="#" className="hover:text-green-400 transition">Rewards Club</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Coupons</a></li>
              </ul>
            )}
          </div>

          {/* Contact Information - Always Visible on Mobile */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Information</h3>
            <p className="text-sm leading-relaxed mb-2">
              <strong>Address:</strong><br />
              <a
                href="https://www.google.com/maps?q=Manjari+Farm,+Opp+Shewalewadi+Jakat+Naka,+Pune-Solapur+Road,+Manjari,+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Manjari Farm, Opp. Shewalewadi Jakat Naka,<br />
                Pune-Solapur Road, Manjari, Pune, Maharashtra.
              </a>
            </p>
            <p className="text-sm mb-1">
              <strong>Phone:</strong>{' '}
              <a href="tel:+919767057658" className="hover:text-green-400 transition">
                +91 9767057658
              </a>
            </p>
            <p className="text-sm mb-4">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:pritam@moregardensindia.com"
                className="text-green-400 hover:underline"
              >
                pritam@moregardensindia.com
              </a>
            </p>

            <h3 className="text-lg font-semibold mb-2 text-white">Connect With Us</h3>
            <div className="flex space-x-4 mt-2 text-lg">
              <a href="#" className="hover:text-green-400 transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-green-400 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-green-400 transition"><FaLinkedinIn /></a>
              <a href="#" className="hover:text-green-400 transition"><FaYoutube /></a>
              <a
                href="https://wa.me/919767057658"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-sm text-gray-400">
        <p className="mb-4 md:mb-0">© 2025 MyGarden. All rights reserved.</p>
        <div className="flex space-x-4">
          <img src="/images/visa.png" alt="Visa" className="h-6" loading="lazy" />
          <img src="/images/mastercard.png" alt="Mastercard" className="h-6" loading="lazy" />
          <img src="/images/amex.png" alt="Amex" className="h-6" loading="lazy" />
          <img src="/images/shop.png" alt="Shop Pay" className="h-6" loading="lazy" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
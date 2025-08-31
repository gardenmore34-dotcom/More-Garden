import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/home'; // Your garden Home page component
import CategoryPage from './pages/CatagoryPage'; // Your category page component
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminForm from './pages/AdminForm'; // Your admin form component
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs'; // Your About Us page component
import ContactUs from './pages/ContactUs'; // Your Contact Us page component
import BlogList from './pages/Blogs'; // Your blog list component
import BlogDetail from './pages/BlogDetails'; // Your blog detail component
import EditProductForm from './pages/EditProductForm';
import ProductInfo from './pages/ProductInfo'; // Your product info component
import Cart from './pages/CartPage'; // Your cart component
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/Profile';
import AdminOrders from './pages/AdminOrders';
import ProductSalesStats from './pages/ProductSale'; // Your product sales stats component
import SearchResultsPage from './pages/SerachPage';
import useAutoLogout from './utils/autoLogout'; 
import AdminTestimonialPage from './pages/AdminTestimonialPage';
import BulkProductPage from './pages/BulkProductPage';
import BulkProduct from './pages/BulkProduct';

export default function App() {
  useAutoLogout();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/type/:type" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductInfo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create" element={<AdminForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/edit/:id" element={<EditProductForm />} />
        <Route path="/bulk" element={<BulkProduct />} />
        <Route path="/bulk/:slug" element={<BulkProductPage />} />
        <Route path="/cart/:userId" element={<Cart />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<ProductSalesStats />} />
        <Route path="/search" element={<SearchResultsPage />} /> 
        <Route path="/admin/testimonials" element={<AdminTestimonialPage />} />

        {/* Add more routes as needed */}
      </Routes>
      <Toaster />
      <Footer />
    </>
  );
}
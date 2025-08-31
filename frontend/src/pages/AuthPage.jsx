import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { loginUser, registerUser } from '../api/authAPI';
import { getUserIdFromToken } from '../utils/authUtils';

import { Mail, Lock, User, Leaf, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setUserInitial } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token);
        const userId = getUserIdFromToken();
        localStorage.setItem('userId', userId);
        
        setIsLoggedIn(true);
        setUserInitial(data.user.name.charAt(0).toUpperCase());

        alert('✅ Logged in successfully');
        navigate('/');
      } else {
        await registerUser(formData);
        alert('✅ Registered successfully, please log in');
        setIsLogin(true);
      }
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('🌐 Google Login clicked — integrate your OAuth logic here!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-[#F0FDF4] to-green-200 px-4">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full transition-all duration-300">
        {/* Left Hero Image */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1616627986376-25b3be7a5c7d?auto=format&fit=crop&w=800&q=80')]"></div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <Leaf className="mx-auto text-green-700" size={32} />
            <h2 className="text-2xl font-bold text-green-800 mt-2">
              {isLogin ? 'Welcome Back 🌿' : 'Create an Account 🌱'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin ? 'Login to explore our garden goodies!' : 'Join our green community!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-green-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-green-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-green-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>

          <div className="mt-5">
            <p className="text-center text-sm text-gray-500 mb-3">Or continue with</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-700 hover:underline font-medium transition"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

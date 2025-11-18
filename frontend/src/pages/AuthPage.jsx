import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { loginUser, registerUser, googleAuth } from '../api/authAPI'; // Add googleAuth here
import { getUserIdFromToken } from '../utils/authUtils';
import home0 from '../assets/Home0.png';
import { Mail, Lock, User, Leaf, Loader2, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const { setIsLoggedIn, setUserInitial } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError('');
    
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
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      if (err.response?.status === 400 && err.response?.data) {
        const errorData = err.response.data;
        
        // Handle validation errors
        if (errorData.message === 'Validation failed' && errorData.errors) {
          const fieldErrors = {};
          errorData.errors.forEach(error => {
            // Extract field name from error message or use a mapping
            if (error.msg.includes('email')) {
              fieldErrors.email = error.msg;
            } else if (error.msg.includes('Password')) {
              fieldErrors.password = error.msg;
            } else if (error.msg.includes('Name')) {
              fieldErrors.name = error.msg;
            } else {
              // If we can't determine the field, show as general error
              setGeneralError(error.msg);
            }
          });
          setErrors(fieldErrors);
        } else {
          // Handle other 400 errors
          setGeneralError(errorData.message || 'Validation failed');
        }
      } else if (err.response?.data?.message) {
        // Handle other API errors
        setGeneralError(err.response.data.message);
      } else {
        // Handle network or other errors
        setGeneralError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    setLoading(true);
    setErrors({});
    setGeneralError('');

    // Decode the JWT token from Google
    const decoded = jwtDecode(credentialResponse.credential);
    
    console.log('Google user data:', decoded);

    // Prepare data for API
    const googleData = {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      googleId: decoded.sub,
      credential: credentialResponse.credential,
    };

    // Call your API function
    const data = await googleAuth(googleData);

    // Store user data (matching your existing format)
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id);

    setIsLoggedIn(true);
    setUserInitial(data.user.name.charAt(0).toUpperCase());

    alert('✅ Google login successful!');
    navigate('/');

  } catch (error) {
    console.error('Google login error:', error);
    setGeneralError(error.message || 'Something went wrong with Google login. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleGoogleError = () => {
  console.error('Google login failed');
  setGeneralError('Google login failed. Please try again.');
};


  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setGeneralError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-[#F0FDF4] to-green-200 px-4">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full transition-all duration-300">
        {/* Left Hero Image - Updated to use home0 */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src={home0} 
            alt="Garden Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-600 bg-opacity-20"></div>
        </div>

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

          {/* General Error Message */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{generalError}</span>
            </div>
          )}

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
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-400 bg-red-50' 
                      : 'border-gray-300 focus:ring-green-400'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.name}
                  </p>
                )}
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
                className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-400 bg-red-50' 
                    : 'border-gray-300 focus:ring-green-400'
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-green-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-400 bg-red-50' 
                    : 'border-gray-300 focus:ring-green-400'
                }`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  {isLogin ? 'Logging in...' : 'Registering...'}
                </>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>

          <div className="mt-5">
  <p className="text-center text-sm text-gray-500 mb-3">Or continue with</p>
  <div className="w-full">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      useOneTap={false}
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
      width="100%"
      disabled={loading}
    />
  </div>
</div>


          <p className="text-sm text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={toggleAuthMode}
              className="text-green-700 hover:underline font-medium transition disabled:opacity-50"
              disabled={loading}
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
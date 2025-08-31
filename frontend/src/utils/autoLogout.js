import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiry = decoded.exp * 1000000000; // JWT exp is in seconds
      const now = Date.now();
      const timeUntilExpiry = expiry - now;

      if (timeUntilExpiry <= 0) {
        handleLogout();
      } else {
        const timer = setTimeout(() => {
          handleLogout();
        }, timeUntilExpiry);

        return () => clearTimeout(timer); // cleanup on unmount
      }
    } catch (err) {
      console.error('Invalid token:', err);
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Session expired. Please log in again.');
    navigate('/auth');
  };
};

export default useAutoLogout;

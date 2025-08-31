import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token) {
      setIsLoggedIn(true);
    }

    if (userName) {
      setUserInitial(userName.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userInitial, setUserInitial }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

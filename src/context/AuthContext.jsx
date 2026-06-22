import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check sessionStorage for existing session
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    const loginTime = sessionStorage.getItem('loginTime');

    if (token && userData && loginTime) {
      const now = Date.now();
      const timeElapsed = now - parseInt(loginTime, 10);
      const sessionDuration = 3600000; // 1 hour

      if (timeElapsed < sessionDuration) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        setRemainingTime(sessionDuration - timeElapsed);

        // Auto logout timer
        const timer = setTimeout(() => {
          logout();
        }, sessionDuration - timeElapsed);

        // Update remaining time
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);

        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        };
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN - Saves to sessionStorage
  const login = (userData, token) => {
    const now = Date.now();
    
    // Save to sessionStorage
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('loginTime', now.toString());
    
    setIsAuthenticated(true);
    setUser(userData);
    setRemainingTime(3600000);

    // Auto logout timer
    const timer = setTimeout(() => {
      logout();
    }, 3600000);

    // Update remaining time
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  };

  // ✅ LOGOUT - Clears both storages (for safety)
  const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('loginTime');

  setIsAuthenticated(false);
  setUser(null);
  setRemainingTime(0);

  toast.success('Logged out successfully');
  navigate('/auth');
};

  // ✅ Get token from sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  // ✅ Check if admin is logged in
  const isAdmin = () => {
    return !!sessionStorage.getItem('adminToken');
  };

  // ✅ Get admin token
  const getAdminToken = () => {
    return sessionStorage.getItem('adminToken');
  };

  // ✅ Format remaining time
  const formatRemainingTime = () => {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        remainingTime,
        formatRemainingTime,
        login,
        logout,
        getToken,
        isAdmin,
        getAdminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
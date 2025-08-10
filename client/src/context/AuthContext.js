import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext(undefined);

// Auth Provider Component
export function AuthProvider({ children }) {
  // Initialize state from localStorage to persist login across sessions
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const isLoggedIn = !!user && !!token;

  // Effect to update localStorage whenever user or token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // Function to handle user login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // The context value that will be provided to consumers
  const contextValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

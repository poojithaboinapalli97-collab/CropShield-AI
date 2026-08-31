import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage on mount
    const savedUser = sessionStorage.getItem('cropshield_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        sessionStorage.removeItem('cropshield_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (name, role = 'Farmer') => {
    const userData = {
      name: name || 'Sardar Rameshwar Singh',
      role: role || 'Farmer',
      isAuthenticated: true,
      loginTime: new Date().toLocaleTimeString(),
    };
    sessionStorage.setItem('cropshield_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    sessionStorage.removeItem('cropshield_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user?.isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext , useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth => AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    const savedUser = localStorage.getItem('amana_user');
    
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('amana_user');
      }
    } else {
      console.log('No user found in localStorage');
    }
    setLoading(false);}, []);

    const login = (userData) => {
        setUser(userData);
        try {
        localStorage.setItem('amana_user', JSON.stringify(userData));
        } catch (error) {
        console.error('Error saving user to localStorage:', error);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('amana_user');
    };
    const isLoggedIn = !!user;

    const value = {
    user,
    login,
    logout,
    isLoggedIn,loading,};

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    );
}
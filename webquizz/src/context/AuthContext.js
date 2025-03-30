import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';

// Context erstellen
export const AuthContext = createContext();

// Provider-Komponente
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Beim Laden: Token überprüfen
  useEffect(() => {
    const token = localStorage.getItem('quizToken');
    if (token) {
      try {
        // Token dekodieren (vereinfacht)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        setUser({ id: payload.id, email: payload.email });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Fehler beim Dekodieren des Tokens:", error);
        localStorage.removeItem('quizToken');
      }
    }
  }, []);

  // Login-Funktion
  const handleLogin = async (credentials) => {
    setAuthError('');
    try {
      const response = await login(credentials);
      const { token } = response.data;
      
      localStorage.setItem('quizToken', token);
      
      // Token dekodieren
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      setUser({ id: payload.id, email: payload.email });
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      setAuthError(error.response?.data?.error || "Login fehlgeschlagen");
      return false;
    }
  };

  // Registrierungs-Funktion
  const handleRegister = async (userData) => {
    setAuthError('');
    try {
      await register(userData);
      return true;
    } catch (error) {
      setAuthError(error.response?.data?.error || "Registrierung fehlgeschlagen");
      return false;
    }
  };

  // Logout-Funktion
  const handleLogout = () => {
    localStorage.removeItem('quizToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Context-Value
  const value = {
    user,
    isLoggedIn,
    authError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
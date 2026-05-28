import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import { getToken, getUser, setToken, setUser, clearSession } from '../utils/tokenUtils';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore authorization state from localStorage
    const savedToken = getToken();
    const savedUser = getUser();
    if (savedToken && savedUser) {
      setTokenState(savedToken);
      setUserState(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const data = await authApi.login(email, password);
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      setTokenState(data.token);
      setUserState(data.user);
      setIsAuthenticated(true);
      return data;
    } else {
      throw new Error('Invalid server response');
    }
  };

  const signupUser = async (name, email, password) => {
    const data = await authApi.signup(name, email, password);
    if (data && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      setTokenState(data.token);
      setUserState(data.user);
      setIsAuthenticated(true);
      return data;
    } else {
      throw new Error('Invalid signup response');
    }
  };

  const logoutUser = () => {
    clearSession();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

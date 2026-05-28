import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data; // Expected response format: { token, user: { id, name, email } }
};

export const signup = async (name, email, password) => {
  const response = await axiosInstance.post('/api/auth/signup', { name, email, password });
  return response.data; // Expected response format: { token, user: { id, name, email } }
};

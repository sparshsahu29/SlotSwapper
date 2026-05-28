import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/api/user/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put('/api/user/profile', profileData);
  return response.data;
};

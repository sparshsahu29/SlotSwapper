import axiosInstance from './axiosInstance';

export const getMyEvents = async () => {
  const response = await axiosInstance.get('/api/events');
  return response.data; // Expected response format: Array of event objects
};

export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/api/events', eventData);
  return response.data; // Expected response format: The created event object
};

export const updateEvent = async (id, eventData) => {
  const response = await axiosInstance.put(`/api/events/${id}`, eventData);
  return response.data; // Expected response format: The updated event object
};

export const deleteEvent = async (id) => {
  const response = await axiosInstance.delete(`/api/events/${id}`);
  return response.data;
};

export const makeSwappable = async (id) => {
  const response = await axiosInstance.patch(`/api/events/${id}/status`, { status: 'SWAPPABLE' });
  return response.data; // Expected response format: The updated event object
};

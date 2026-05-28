import axiosInstance from './axiosInstance';

export const getSwappableSlots = async () => {
  const response = await axiosInstance.get('/api/swappable-slots');
  return response.data; // Array of other users' swappable slot items
};

export const requestSwap = async ({ mySlotId, theirSlotId }) => {
  const response = await axiosInstance.post('/api/swap-request', {
    my_slot_id: mySlotId,
    their_slot_id: theirSlotId,
  });
  return response.data; // Swap request object
};

export const respondToSwap = async (requestId, accepted) => {
  const response = await axiosInstance.post(`/api/swap-response/${requestId}`, {
    accepted,
  });
  return response.data;
};

export const getIncomingRequests = async () => {
  const response = await axiosInstance.get('/api/swap-requests/incoming');
  return response.data; // Array of incoming swap requests
};

export const getOutgoingRequests = async () => {
  const response = await axiosInstance.get('/api/swap-requests/outgoing');
  return response.data; // Array of outgoing swap requests
};

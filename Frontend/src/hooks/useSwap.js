import { useState, useCallback, useEffect } from 'react';
import * as swapApi from '../api/swapApi';
import toast from 'react-hot-toast';

export const useSwap = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingIncoming, setLoadingIncoming] = useState(false);
  const [loadingOutgoing, setLoadingOutgoing] = useState(false);

  const fetchSwappableSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const data = await swapApi.getSwappableSlots();
      setSwappableSlots(data);
    } catch (err) {
      console.error('Error fetching swappable slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const fetchIncomingRequests = useCallback(async () => {
    setLoadingIncoming(true);
    try {
      const data = await swapApi.getIncomingRequests();
      setIncomingRequests(data);
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
    } finally {
      setLoadingIncoming(false);
    }
  }, []);

  const fetchOutgoingRequests = useCallback(async () => {
    setLoadingOutgoing(true);
    try {
      const data = await swapApi.getOutgoingRequests();
      setOutgoingRequests(data);
    } catch (err) {
      console.error('Error fetching outgoing requests:', err);
    } finally {
      setLoadingOutgoing(false);
    }
  }, []);

  const sendSwapRequest = async ({ mySlotId, theirSlotId }) => {
    try {
      const result = await swapApi.requestSwap({ mySlotId, theirSlotId });
      toast.success('Swap request transmitted successfully!');
      // Refresh Lists
      await Promise.all([fetchSwappableSlots(), fetchOutgoingRequests()]);
      return result;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit swap request.';
      toast.error(errMsg);
      throw err;
    }
  };

  const respondToRequest = async (requestId, accepted) => {
    try {
      await swapApi.respondToSwap(requestId, accepted);
      toast.success(accepted ? 'Swap request approved!' : 'Swap request declined.');
      // Refresh Lists
      await Promise.all([
        fetchIncomingRequests(),
        fetchSwappableSlots(),
        fetchOutgoingRequests()
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit response.';
      toast.error(errMsg);
      throw err;
    }
  };

  const fetchAll = useCallback(() => {
    return Promise.all([
      fetchSwappableSlots(),
      fetchIncomingRequests(),
      fetchOutgoingRequests(),
    ]);
  }, [fetchSwappableSlots, fetchIncomingRequests, fetchOutgoingRequests]);

  // Handle automatic refreshing on WebSocket signals
  useEffect(() => {
    const handleUpdate = () => {
      fetchAll();
    };

    window.addEventListener('ws-new-swap-request', handleUpdate);
    window.addEventListener('ws-swap-accepted', handleUpdate);
    window.addEventListener('ws-swap-rejected', handleUpdate);

    return () => {
      window.removeEventListener('ws-new-swap-request', handleUpdate);
      window.removeEventListener('ws-swap-accepted', handleUpdate);
      window.removeEventListener('ws-swap-rejected', handleUpdate);
    };
  }, [fetchAll]);

  return {
    swappableSlots,
    incomingRequests,
    outgoingRequests,
    loadingSlots,
    loadingIncoming,
    loadingOutgoing,
    sendSwapRequest,
    respondToRequest,
    fetchSwappableSlots,
    fetchIncomingRequests,
    fetchOutgoingRequests,
    fetchAll,
  };
};

export default useSwap;

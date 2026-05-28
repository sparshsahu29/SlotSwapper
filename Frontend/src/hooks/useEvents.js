import { useState, useEffect, useCallback } from 'react';
import * as eventsApi from '../api/eventsApi';
import toast from 'react-hot-toast';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsApi.getMyEvents();
      // Sort: closest coming events first
      const sorted = [...data].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setEvents(sorted);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (eventData) => {
    try {
      const newEvent = await eventsApi.createEvent(eventData);
      toast.success(`Successfully scheduled "${newEvent.title}"!`);
      await fetchEvents();
      return newEvent;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
      throw err;
    }
  };

  const editEvent = async (id, eventData) => {
    try {
      const updated = await eventsApi.updateEvent(id, eventData);
      toast.success('Event updated successfully!');
      await fetchEvents();
      return updated;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event');
      throw err;
    }
  };

  const removeEvent = async (id) => {
    try {
      await eventsApi.deleteEvent(id);
      toast.success('Event cancelled successfully.');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
      throw err;
    }
  };

  const markAsSwappable = async (id) => {
    try {
      await eventsApi.makeSwappable(id);
      toast.success('Your slot is now marked as swappable in the marketplace!');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event slot status');
      throw err;
    }
  };

  // Real-time listener for updating UI on socket signals
  useEffect(() => {
    const handleRefresh = () => {
      fetchEvents();
    };

    window.addEventListener('ws-swap-accepted', handleRefresh);
    
    return () => {
      window.removeEventListener('ws-swap-accepted', handleRefresh);
    };
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    editEvent,
    removeEvent,
    markAsSwappable,
  };
};

export default useEvents;

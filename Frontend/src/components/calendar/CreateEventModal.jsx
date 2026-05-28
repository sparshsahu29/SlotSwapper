import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

export const CreateEventModal = ({ isOpen, onClose, onCreate, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default initial dates when modal is opened (e.g. current hour + 1 hour)
  useEffect(() => {
    if (isOpen) {
      const now = defaultDate ? new Date(defaultDate) : new Date();
      if (defaultDate) {
        // Preserve selected date, but use current hours + 1 for user convenience
        const d = new Date();
        now.setHours(d.getHours() + 1);
        now.setMinutes(0);
        now.setSeconds(0);
      } else {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        now.setSeconds(0);
      }
      
      const start = new Date(now);
      
      // Calculate end time: 1 hour after start
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      // Format to YYYY-MM-DDTHH:MM local string
      const pad = (num) => String(num).padStart(2, '0');
      const formatLocal = (d) => {
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setStartTime(formatLocal(start));
      setEndTime(formatLocal(end));
      setTitle('');
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Event title is required.');
      return;
    }
    if (!startTime) {
      toast.error('Start time is required.');
      return;
    }
    if (!endTime) {
      toast.error('End time is required.');
      return;
    }

    const startObj = new Date(startTime);
    const endObj = new Date(endTime);

    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      toast.error('Please specify valid dates.');
      return;
    }

    if (startObj >= endObj) {
      toast.error('The start time must occur before the end time.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        start_time: startObj.toISOString(),
        end_time: endObj.toISOString(),
        status: 'BUSY', // Slots defaults to BUSY
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Scheduled Slot">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="modal-event-title" className="block text-xs font-semibold text-text-secondary uppercase mb-1 tracking-wide">
            Event Title
          </label>
          <input
            id="modal-event-title"
            type="text"
            required
            className="input"
            placeholder="e.g. Design Sync / Client Presentation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="modal-event-start" className="block text-xs font-semibold text-text-secondary uppercase mb-1 tracking-wide">
            Start Date & Time
          </label>
          <input
            id="modal-event-start"
            type="datetime-local"
            required
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="modal-event-end" className="block text-xs font-semibold text-text-secondary uppercase mb-1 tracking-wide">
            End Date & Time
          </label>
          <input
            id="modal-event-end"
            type="datetime-local"
            required
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-6">
          <button
            type="button"
            className="btn-ghost text-xs px-4 py-2 cursor-pointer"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary text-xs px-4 py-2 cursor-pointer flex items-center gap-1.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventModal;

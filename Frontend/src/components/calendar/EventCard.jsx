import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Globe, Sparkles } from 'lucide-react';
import { formatEventRange } from '../../utils/dateUtils';
import Badge from '../ui/Badge';

export const EventCard = ({ event, onMakeSwappable, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSwappableClick = async () => {
    setIsUpdating(true);
    try {
      await onMakeSwappable(event.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to cancel the event "${event.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(event.id);
      } catch (e) {
        console.error(e);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const starts = event.start_time;
  const ends = event.end_time;
  const status = event.status || 'BUSY';

  return (
    <div className="card hover:border-accent/50 transition-colors duration-150 flex flex-col justify-between h-full group relative overflow-hidden bg-bg-card border border-border">
      {/* Decorative accent highlight for swappable vs pending vs busy slots */}
      <div 
        className={`absolute top-0 left-0 w-1 h-full ${
          status === 'SWAPPABLE' 
            ? 'bg-accent' 
            : status === 'SWAP_PENDING' 
            ? 'bg-warning' 
            : 'bg-border'
        }`}
      />

      <div className="pl-2.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-text-primary text-base group-hover:text-accent transition-colors duration-150 truncate max-w-45" title={event.title}>
            {event.title}
          </h4>
          <Badge status={status} />
        </div>

        {/* Date Time Range text */}
        <div className="flex items-center gap-2 text-text-secondary text-xs mb-4">
          <Calendar size={13} className="text-cyan text-opacity-80 shrink-0" />
          <span className="font-mono">{formatEventRange(starts, ends)}</span>
        </div>
      </div>

      <div className="pl-2.5 pt-3 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
        {status === 'BUSY' ? (
          <button
            onClick={handleSwappableClick}
            disabled={isUpdating}
            className="flex items-center gap-1 bg-accent/10 hover:bg-accent/25 text-accent text-xs font-semibold py-1.5 px-3 rounded-md transition-all duration-150 border border-accent/25 hover:border-accent/40 disabled:opacity-50 cursor-pointer"
          >
            <Globe size={11} className="inline-block" />
            <span>{isUpdating ? 'Sharing...' : 'Make Swappable'}</span>
          </button>
        ) : status === 'SWAPPABLE' ? (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Sparkles size={12} className="text-accent animate-pulse" />
            <span>Shared on Marketplace</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-warning">
            <Clock size={12} />
            <span>Swap Proposal Pending</span>
          </div>
        )}

        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/15 rounded-md transition-all duration-150 cursor-pointer"
          title="Cancel Calendar Event"
          aria-label="Delete Event"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;

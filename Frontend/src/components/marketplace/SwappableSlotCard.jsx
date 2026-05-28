import React from 'react';
import { Calendar, User, ArrowLeftRight, Clock, ShieldAlert } from 'lucide-react';
import { formatEventRange } from '../../utils/dateUtils';
import Badge from '../ui/Badge';

export const SwappableSlotCard = ({ slot, isPending, onRequestSwap }) => {
  const starts = slot.start_time;
  const ends = slot.end_time;
  const ownerName = slot.owner_name || slot.user?.name || 'Peer User';

  return (
    <div className="card hover:border-cyan/40 transition-colors duration-150 flex flex-col justify-between h-full relative overflow-hidden bg-bg-card border border-border">
      {/* Visual Cyan highlight border */}
      <div className="absolute top-0 left-0 w-1 h-full bg-cyan" />

      <div className="pl-2.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-text-primary text-base truncate max-w-50" title={slot.title}>
            {slot.title}
          </h4>
          {isPending ? (
            <Badge status="pending" text="PENDING SWAP" />
          ) : (
            <Badge status="swappable" text="AVAILABLE" />
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
          <User size={13} className="text-cyan text-opacity-85 shrink-0" />
          <span>Posted by: <strong className="text-text-primary">{ownerName}</strong></span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-text-secondary text-xs mb-4">
          <Calendar size={13} className="text-text-secondary shrink-0" />
          <span className="font-mono">{formatEventRange(starts, ends)}</span>
        </div>
      </div>

      <div className="pl-2.5 pt-3 border-t border-border/60 flex items-center justify-end mt-auto">
        {isPending ? (
          <div className="flex items-center gap-1.5 text-xs text-warning bg-warning/5 px-2.5 py-1.5 rounded-md border border-warning/10 font-medium">
            <Clock size={12} className="animate-pulse" />
            <span>Request Pending</span>
          </div>
        ) : (
          <button
            onClick={() => onRequestSwap(slot)}
            className="flex items-center gap-1.5 bg-cyan text-ocean-page hover:bg-cyan-hover text-xs font-bold py-1.5 px-3 rounded-md transition-all duration-150 cursor-pointer"
          >
            <ArrowLeftRight size={13} />
            <span>Request Swap</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SwappableSlotCard;

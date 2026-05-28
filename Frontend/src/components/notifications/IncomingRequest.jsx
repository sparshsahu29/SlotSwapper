import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Calendar, User } from 'lucide-react';
import { formatEventRange } from '../../utils/dateUtils';

export const IncomingRequest = ({ request, onRespond }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const requesterName = request.requester_name || request.requester?.name || 'Peer User';
  
  const requesterSlot = request.requester_slot || request.requester_event || {};
  const responderSlot = request.responder_slot || request.responder_event || {};

  const handleResponse = async (accepted) => {
    if (accepted) {
      setIsAccepting(true);
    } else {
      setIsRejecting(true);
    }
    
    try {
      await onRespond(request.id, accepted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  const isWorking = isAccepting || isRejecting;

  return (
    <div className="card hover:border-warning/30 transition-colors duration-150 bg-bg-card border border-border p-5 relative overflow-hidden">
      {/* Pending Yellow indicator bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-warning" />

      <div className="flex flex-col gap-4">
        {/* Header summary info */}
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center border border-warning/15">
            <User size={14} className="text-warning" />
          </div>
          <div>
            <h5 className="text-sm font-semibold text-text-primary">
              <strong className="text-cyan">{requesterName}</strong> wants to swap with you
            </h5>
            <span className="text-[10px] text-text-secondary">Proposing a mutually beneficial swap</span>
          </div>
        </div>

        {/* Comparison Trade Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-black/30 border border-border/40 rounded-lg p-3">
          {/* Responder's Slot (Your Slot) */}
          <div className="text-left py-1 px-2 border-r md:border-r border-border/40 border-b md:border-b-0 pb-3 md:pb-1">
            <span className="text-[10px] font-bold text-text-secondary tracking-wider block mb-0.5 uppercase">
              Your Slot (They Want)
            </span>
            <h6 className="text-xs font-bold text-text-primary truncate">{responderSlot.title || 'Your Slot'}</h6>
            <p className="text-[10px] text-text-secondary font-mono mt-1">
              {formatEventRange(responderSlot.start_time, responderSlot.end_time)}
            </p>
          </div>

          {/* Requester's Slot (What they offer) */}
          <div className="text-left py-1 px-2">
            <span className="text-[10px] font-bold text-cyan tracking-wider block mb-0.5 uppercase">
              Proposing (You Get)
            </span>
            <h6 className="text-xs font-bold text-text-primary truncate">{requesterSlot.title || 'Their Slot'}</h6>
            <p className="text-[10px] text-text-secondary font-mono mt-1">
              {formatEventRange(requesterSlot.start_time, requesterSlot.end_time)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 mt-1">
          <button
            onClick={() => handleResponse(false)}
            disabled={isWorking}
            className="btn-danger text-xs font-semibold py-1.5 px-3 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <X size={13} />
            <span>{isRejecting ? 'Rejecting...' : 'Decline'}</span>
          </button>
          
          <button
            onClick={() => handleResponse(true)}
            disabled={isWorking}
            className="btn-success text-xs font-semibold py-1.5 px-3 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Check size={13} />
            <span>{isAccepting ? 'Accepting...' : 'Accept Swap'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingRequest;

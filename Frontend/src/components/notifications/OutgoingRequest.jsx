import React from 'react';
import { ArrowLeftRight, Calendar, User, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatEventRange } from '../../utils/dateUtils';
import Badge from '../ui/Badge';

export const OutgoingRequest = ({ request }) => {
  const responderName = request.responder_name || request.responder?.name || 'Peer User';
  const status = request.status || 'PENDING';

  const mySlot = request.my_slot || request.my_event || {};
  const theirSlot = request.their_slot || request.their_event || {};

  // Status highlights or icons
  let statusColor = 'border-warning/30 bg-warning/5 text-warning';
  let StatusIcon = Clock;
  if (status.toUpperCase() === 'ACCEPTED') {
    statusColor = 'border-success/35 bg-success/5 text-success';
    StatusIcon = CheckCircle2;
  } else if (status.toUpperCase() === 'REJECTED') {
    statusColor = 'border-danger/35 bg-danger/5 text-danger';
    StatusIcon = XCircle;
  }

  return (
    <div className="card bg-bg-card border border-border p-4.5 relative overflow-hidden">
      {/* Dynamic Status Border indicator on left */}
      <div 
        className={`absolute top-0 left-0 w-1 h-full ${
          status.toUpperCase() === 'ACCEPTED' 
            ? 'bg-success' 
            : status.toUpperCase() === 'REJECTED' 
            ? 'bg-danger' 
            : 'bg-warning'
        }`}
      />

      <div className="flex flex-col gap-3.5 pl-1">
        {/* Header containing name and status text badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <User size={13} className="text-text-secondary" />
            <span className="text-xs font-semibold text-text-primary">
              Proposed swap to: <span className="text-cyan font-bold">{responderName}</span>
            </span>
          </div>
          <Badge status={status} />
        </div>

        {/* Trade Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-black/20 border border-border/40 rounded-lg p-3">
          {/* Proposing (My Slot) */}
          <div className="text-left border-r md:border-r border-border/40 border-b md:border-b-0 pb-3 md:pb-0.5 px-1.5">
            <span className="text-[9px] font-bold text-text-secondary tracking-wider block mb-0.5 uppercase">
              You Offered (My Slot)
            </span>
            <div className="text-xs font-bold text-text-primary truncate">{mySlot.title || 'Your Slot'}</div>
            <p className="text-[10px] text-text-secondary font-mono mt-0.5">
              {formatEventRange(mySlot.start_time, mySlot.end_time)}
            </p>
          </div>

          {/* Requesting (Their Slot) */}
          <div className="text-left px-1.5">
            <span className="text-[9px] font-bold text-cyan tracking-wider block mb-0.5 uppercase">
              You Requested (Their Slot)
            </span>
            <div className="text-xs font-bold text-text-primary truncate">{theirSlot.title || 'Their Slot'}</div>
            <p className="text-[10px] text-text-secondary font-mono mt-0.5">
              {formatEventRange(theirSlot.start_time, theirSlot.end_time)}
            </p>
          </div>
        </div>

        {/* Status explanation */}
        <div className={`flex items-center gap-1.5 border rounded px-3 py-1.5 text-xs font-medium w-fit ${statusColor}`}>
          <StatusIcon size={12} className={status === 'PENDING' ? 'animate-pulse' : ''} />
          <span>
            {status.toUpperCase() === 'ACCEPTED' 
              ? 'This deal has been approved. Your schedule has updated!' 
              : status.toUpperCase() === 'REJECTED' 
              ? 'This proposal was declined by the owner.' 
              : 'Awaiting peer approval.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OutgoingRequest;

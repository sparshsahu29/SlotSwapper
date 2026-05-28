import React from 'react';
import SwappableSlotCard from './SwappableSlotCard';
import Loader from '../ui/Loader';
import { ShoppingBag } from 'lucide-react';

export const MarketplaceList = ({
  slots = [],
  outgoingRequests = [],
  onRequestSwap,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader message="Loading available peer slots..." />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-bg-secondary border border-dashed border-border rounded-card text-center gap-4 py-16">
        <div className="bg-border p-4 rounded-full">
          <ShoppingBag className="h-8 w-8 text-text-secondary" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-text-primary">Marketplace is peaceful</h4>
          <p className="text-xs text-text-secondary mt-1 max-w-sm">
            There are currenty no swappable slot offerings published by other users. Check back later or ask your team to list a slot.
          </p>
        </div>
      </div>
    );
  }

  // Helper to cross-reference if we already sent a swap request for a given marketplace slot
  const checkIsRequestPending = (slotId) => {
    return outgoingRequests.some(
      (req) => req.their_slot_id === slotId && req.status?.toUpperCase() === 'PENDING'
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {slots.map((slot) => (
        <SwappableSlotCard
          key={slot.id}
          slot={slot}
          isPending={checkIsRequestPending(slot.id)}
          onRequestSwap={onRequestSwap}
        />
      ))}
    </div>
  );
};

export default MarketplaceList;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MarketplaceList from '../components/marketplace/MarketplaceList';
import RequestSwapModal from '../components/marketplace/RequestSwapModal';
import useSwap from '../hooks/useSwap';
import useEvents from '../hooks/useEvents';
import { ShoppingBag, Landmark, ArrowLeftRight } from 'lucide-react';

export const MarketplacePage = () => {
  const {
    swappableSlots,
    outgoingRequests,
    loadingSlots,
    sendSwapRequest,
    fetchSwappableSlots,
    fetchOutgoingRequests,
  } = useSwap();

  const { events, fetchEvents } = useEvents();

  // Modal active states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTargetSlot, setSelectedTargetSlot] = useState(null);

  useEffect(() => {
    fetchSwappableSlots();
    fetchOutgoingRequests();
    fetchEvents();
  }, [fetchSwappableSlots, fetchOutgoingRequests, fetchEvents]);

  // Extract logged-in user's own swappable slots as trade items
  const mySwappableSlots = events.filter((e) => e.status === 'SWAPPABLE');

  const handleRequestSwapClick = (slot) => {
    setSelectedTargetSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmSwap = async ({ mySlotId, theirSlotId }) => {
    await sendSwapRequest({ mySlotId, theirSlotId });
    // Refresh local events list to reflect slot status changes (from SWAPPABLE to SWAP_PENDING)
    await fetchEvents();
  };

  // Stats summaries for desk layout
  const totalEventsCount = events.length;
  const swappableCount = mySwappableSlots.length;
  const pendingIncomingCount = 0; // Handled in individual fetch hooks

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <div className="pt-16 max-w-7xl mx-auto flex">
        {/* Left sidebar layout */}
        <Sidebar
          eventsCount={totalEventsCount}
          swappableCount={swappableCount}
          pendingCount={pendingIncomingCount}
        />

        {/* Content pane */}
        <main className="flex-1 px-4 py-6 md:px-8 lg:ml-64 animate-fade-in-up">
          {/* Page Headers */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border/60">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <ShoppingBag className="text-cyan h-5 w-5 md:h-6 md:w-6" />
                Slot Marketplace
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Browse swappable time slots offered by other team members and propose a swap.
              </p>
            </div>
          </div>

          {/* Quick tips box */}
          <div className="bg-cyan/5 border border-cyan/15 rounded-card p-4 mb-6 flex items-start gap-3">
            <div className="bg-cyan/10 p-2 rounded-full mt-0.5 text-cyan">
              <ArrowLeftRight size={15} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">How peer swapping works</h4>
              <p className="text-[11px] text-text-secondary leading-normal mt-0.5">
                Propose one of your own <strong>Swappable</strong> slots in exchange for any available slot listed below. 
                The slot owner will receive a real-time alert and can approve or decline your trade deal.
              </p>
            </div>
          </div>

          {/* Main List Rendering */}
          <MarketplaceList
            loading={loadingSlots}
            slots={swappableSlots}
            outgoingRequests={outgoingRequests}
            onRequestSwap={handleRequestSwapClick}
          />
        </main>
      </div>

      {/* Proposing swap confirmation modal */}
      <RequestSwapModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTargetSlot(null);
        }}
        targetSlot={selectedTargetSlot}
        mySwappableSlots={mySwappableSlots}
        onConfirmSwap={handleConfirmSwap}
      />
    </div>
  );
};

export default MarketplacePage;

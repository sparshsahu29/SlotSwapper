import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import IncomingRequest from '../components/notifications/IncomingRequest';
import OutgoingRequest from '../components/notifications/OutgoingRequest';
import Loader from '../components/ui/Loader';
import useSwap from '../hooks/useSwap';
import useEvents from '../hooks/useEvents';
import { BellRing, ArrowUpRight, ArrowDownLeft, Inbox } from 'lucide-react';

export const NotificationsPage = () => {
  const {
    incomingRequests,
    outgoingRequests,
    loadingIncoming,
    loadingOutgoing,
    respondToRequest,
    fetchIncomingRequests,
    fetchOutgoingRequests,
  } = useSwap();

  const { events, fetchEvents } = useEvents();

  useEffect(() => {
    fetchIncomingRequests();
    fetchOutgoingRequests();
    fetchEvents();
  }, [fetchIncomingRequests, fetchOutgoingRequests, fetchEvents]);

  // Handle incoming approval or rejection response
  const handleRespondToRequest = async (requestId, accepted) => {
    await respondToRequest(requestId, accepted);
    // Refresh events to reflect final schedule slot status changes
    await fetchEvents();
  };

  // Filter incoming requests to focus mostly on active PENDING ones, or list all
  const activeIncoming = incomingRequests.filter((r) => r.status?.toUpperCase() === 'PENDING');
  const pastIncoming = incomingRequests.filter((r) => r.status?.toUpperCase() !== 'PENDING');

  // Stats summaries for side nav layout
  const totalEventsCount = events.length;
  const swappableCount = events.filter((e) => e.status === 'SWAPPABLE').length;
  const pendingIncomingCount = activeIncoming.length;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <div className="pt-16 max-w-7xl mx-auto flex">
        {/* Left sidebar panel */}
        <Sidebar
          eventsCount={totalEventsCount}
          swappableCount={swappableCount}
          pendingCount={pendingIncomingCount}
        />

        {/* Content workspace */}
        <main className="flex-1 px-4 py-6 md:px-8 lg:ml-64 animate-fade-in-up">
          {/* Page Headers */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border/60">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <BellRing className="text-cyan h-5 w-5 md:h-6 md:w-6" />
                Trade Deals & Notifications
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Approve incoming swap proposals or check the status of trade requests you sent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 1. INCOMING REQUESTS PANEL */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <ArrowDownLeft className="text-success h-4 w-4" />
                Incoming Swap Proposals ({activeIncoming.length})
              </h2>

              {loadingIncoming ? (
                <div className="py-10 flex justify-center">
                  <Loader message="Loading incoming trade requests..." />
                </div>
              ) : activeIncoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 bg-bg-secondary border border-dashed border-border rounded-card text-center gap-3 py-10">
                  <div className="bg-border p-3 rounded-full text-text-secondary">
                    <Inbox size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary">All caught up</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      No pending trade proposals from your peers at this time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeIncoming.map((req) => (
                    <IncomingRequest
                      key={req.id}
                      request={req}
                      onRespond={handleRespondToRequest}
                    />
                  ))}
                </div>
              )}

              {/* Past incoming notifications histories if exist */}
              {pastIncoming.length > 0 && (
                <div className="pt-4 border-t border-border/45">
                  <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-3">
                    Recent Incoming Responses
                  </h3>
                  <div className="space-y-2 opacity-70">
                    {pastIncoming.slice(0, 3).map((req) => {
                      const reqName = req.requester_name || req.requester?.name || 'Peer';
                      return (
                        <div key={req.id} className="text-xs p-3 bg-bg-secondary rounded border border-border/40 flex justify-between items-center">
                          <span>
                            Mutual slot swap request with <strong>{reqName}</strong>
                          </span>
                          <span className={`${req.status === 'ACCEPTED' ? 'text-success' : 'text-danger'} font-semibold text-[10px]`}>
                            {req.status?.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. OUTGOING REQUESTS PANEL */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <ArrowUpRight className="text-cyan h-4 w-4" />
                Outgoing Requests Status ({outgoingRequests.length})
              </h2>

              {loadingOutgoing ? (
                <div className="py-10 flex justify-center">
                  <Loader message="Loading outgoing requests..." />
                </div>
              ) : outgoingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 bg-bg-secondary border border-dashed border-border rounded-card text-center gap-3 py-10">
                  <div className="bg-border p-3 rounded-full text-text-secondary">
                    <ArrowUpRight size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary">No outbound requests</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5 max-w-60 mx-auto">
                      You haven't requested any swaps yet. Visit the Marketplace to trade time slots.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((req) => (
                    <OutgoingRequest key={req.id} request={req} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;

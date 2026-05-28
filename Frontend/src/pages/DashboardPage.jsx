import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import EventList from '../components/calendar/EventList';
import CalendarView from '../components/calendar/CalendarView';
import CreateEventModal from '../components/calendar/CreateEventModal';
import Loader from '../components/ui/Loader';
import useEvents from '../hooks/useEvents';
import useSwap from '../hooks/useSwap';
import { Plus, ToggleLeft, ToggleRight, CalendarClock, Globe, Clock, ShieldAlert, Calendar, List } from 'lucide-react';
import { parseISO } from 'date-fns';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { events, loading, fetchEvents, addEvent, markAsSwappable, removeEvent } = useEvents();
  const { incomingRequests, fetchIncomingRequests, swappableSlots, fetchSwappableSlots } = useSwap();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState('calendar'); // 'calendar' or 'list'
  const [selectedModalDate, setSelectedModalDate] = useState(null);
  
  // Filtering states: 'ALL', 'BUSY', 'SWAPPABLE', 'SWAP_PENDING'
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchEvents();
    fetchIncomingRequests();
    fetchSwappableSlots();
  }, [fetchEvents, fetchIncomingRequests, fetchSwappableSlots]);

  // Counts for statistics
  const totalEventsCount = events.length;
  const swappableCount = events.filter((e) => e.status === 'SWAPPABLE').length;
  const pendingIncomingCount = incomingRequests.filter((r) => r.status?.toUpperCase() === 'PENDING').length;

  const filteredEvents = events.filter((event) => {
    if (filter === 'ALL') return true;
    return event.status === filter;
  });

  const handleCreateEvent = async (eventData) => {
    await addEvent(eventData);
  };

  // Build out stunning "Marketplace Picks" preview matching design HTML layout with mock fallbacks
  const picksToShow = swappableSlots && swappableSlots.length > 0
    ? swappableSlots.slice(0, 3)
    : [
        {
          id: 'placeholder-1',
          title: 'Product Strategy Q4',
          owner_name: 'Derek Hale',
          start_time: '2026-06-05T11:30:00Z',
          relative: '2h ago'
        },
        {
          id: 'placeholder-2',
          title: '1-on-1 Mentorship',
          owner_name: 'Elena G.',
          start_time: '2026-06-01T16:00:00Z',
          relative: '5h ago'
        }
      ];
const formatPickTime = (timeStr) => {
    if (!timeStr) return 'Time TBD';
    
    try {
      // 1. SANITIZE: Strip the rogue 'Z' if it follows a timezone offset like +05:30Z
      // This turns "2026-05-30T01:00:00+05:30Z" into a valid "2026-05-30T01:00:00+05:30"
      const cleanedTimeStr = timeStr.replace(/([+-]\d{2}:\d{2})Z$/, '$1');
      
      // 2. Try native parsing first with the clean string
      let d = new Date(cleanedTimeStr);
      
      // 3. Fallback to date-fns if native still struggles
      if (isNaN(d.getTime()) && typeof cleanedTimeStr === 'string') {
        d = parseISO(cleanedTimeStr);
      }
      
      // 4. Final safety check
      if (isNaN(d.getTime())) return 'Invalid Time';
      
      // 5. Format beautifully
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = days[d.getDay()];
      
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = d.getMinutes().toString().padStart(2, '0');
      
      return `${day}, ${hours}:${mins} ${ampm}`;
    } catch (e) {
      return 'Upcoming Slot';
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar fixed top */}
      <Navbar />

      {/* Main layout splitting sidebar and content */}
      <div className="pt-16 max-w-7xl mx-auto flex">
        {/* Left Sidebar desktop only */}
        <Sidebar
          eventsCount={totalEventsCount}
          swappableCount={swappableCount}
          pendingCount={pendingIncomingCount}
        />

        {/* Core content grid. Left margin lg:ml-64 makes room for the sidebar */}
        <main className="flex-1 px-4 py-6 md:px-8 lg:ml-64 animate-fade-in-up">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border/60">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <CalendarClock className="text-cyan h-5 w-5 md:h-6 md:w-6" />
                My Calendar Schedule
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Manage your busy slots, select ones to share on the market, and request trades.
              </p>
            </div>
            
            <button
              onClick={() => { setSelectedModalDate(null); setIsModalOpen(true); }}
              className="btn-primary text-xs font-semibold py-2.5 px-4 rounded-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Schedule Slot</span>
            </button>
          </div>

          {/* 12-Column Layout Grid matching "Elegant Dark" design theme precisely */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
            {/* Left Content Column (8 Columns value) */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/40">
                <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase select-none">
                  My Calendar Slots
                </h2>
                
                {/* Visual Mode Toggler */}
                <div className="bg-bg-secondary p-1 rounded-lg border border-border/80 flex items-center gap-1 w-fit select-none">
                  <button
                    onClick={() => setViewType('calendar')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 cursor-pointer ${
                      viewType === 'calendar'
                        ? 'bg-accent text-white shadow'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <Calendar size={13} />
                    <span>Visual Calendar</span>
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 cursor-pointer ${
                      viewType === 'list'
                        ? 'bg-accent text-white shadow'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <List size={13} />
                    <span>List Agenda</span>
                  </button>
                </div>
              </div>

              {/* View Content Branching */}
              {viewType === 'calendar' ? (
                <CalendarView
                  events={events}
                  onMakeSwappable={markAsSwappable}
                  onDelete={removeEvent}
                  onCreateClick={(date) => {
                    setSelectedModalDate(date);
                    setIsModalOpen(true);
                  }}
                  setSelectedDateExternal={setSelectedModalDate}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Quick Filters Toolbar - shown only in List view */}
                  <div className="flex flex-wrap items-center gap-2 bg-bg-secondary p-1.5 rounded-lg border border-border/85 w-fit">
                    {[
                      { id: 'ALL', label: 'All Slots' },
                      { id: 'BUSY', label: 'Busy Only' },
                      { id: 'SWAPPABLE', label: 'Shared Swappable' },
                      { id: 'SWAP_PENDING', label: 'Proposals Pending' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 cursor-pointer ${
                          filter === item.id
                            ? 'bg-accent text-white shadow'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Core Schedule Event Cards Container */}
                  {loading && events.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="card h-32 bg-bg-card animate-pulse border border-border block" />
                      ))}
                    </div>
                  ) : (
                    <EventList
                      events={filteredEvents}
                      onMakeSwappable={markAsSwappable}
                      onDelete={removeEvent}
                      onCreateClick={() => {
                        setSelectedModalDate(null);
                        setIsModalOpen(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right Side Column (4 Columns value) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              
              {/* Marketplace Picks premium box with oceanic deep gradients */}
              <section className="bg-linear-to-br from-ocean-card to-ocean-page border border-slate-800/50 rounded-2xl p-5 shadow-2xl">
                <h2 className="text-sm font-bold text-cyan mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v20" />
                    <path d="m17 5-5-3-5 3" />
                    <path d="m17 19-5 3-5-3" />
                    <rect width="20" height="8" x="2" y="8" rx="2" />
                  </svg>
                  Marketplace Picks
                </h2>
                
                <div className="space-y-4">
                  {picksToShow.map((pick) => (
                    <div 
                      key={pick.id} 
                      onClick={() => navigate('/marketplace')}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-cyan font-bold tracking-wider">SWAPPABLE</span>
                        <span className="text-[10px] text-text-secondary">{pick.relative || 'Just now'}</span>
                      </div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan transition-colors duration-150">{pick.title}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Owner: {pick.owner_name} • {formatPickTime(pick.start_time)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all text-white cursor-pointer"
                >
                  Enter Marketplace
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedModalDate(null); }}
        onCreate={handleCreateEvent}
        defaultDate={selectedModalDate}
      />
    </div>
  );
};

export default DashboardPage;

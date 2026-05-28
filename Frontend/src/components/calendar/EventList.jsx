import React from 'react';
import EventCard from './EventCard';
import { CalendarX, Plus } from 'lucide-react';

export const EventList = ({ events = [], onMakeSwappable, onDelete, onCreateClick }) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-bg-secondary border border-dashed border-border rounded-card text-center gap-4 py-16">
        <div className="bg-border p-4 rounded-full">
          <CalendarX className="h-8 w-8 text-text-secondary" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-text-primary">No events scheduled</h4>
          <p className="text-xs text-text-secondary mt-1 max-w-sm">
            Your calendar is empty. Schedule tasks, meetings, or busy periods, then publish them to Swap with peers.
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="btn-primary flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-md cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Custom Slot</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onMakeSwappable={onMakeSwappable}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EventList;

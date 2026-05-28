import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List, Plus, Trash2, Globe, Sparkles, Clock } from 'lucide-react';
import { formatEventRange } from '../../utils/dateUtils';
import Badge from '../ui/Badge';

export const CalendarView = ({ events = [], onMakeSwappable, onDelete, onCreateClick, defaultDate, setSelectedDateExternal }) => {
  const [currentPivotDate, setCurrentPivotDate] = useState(new Date('2026-05-28T00:00:00Z')); // Base matching the user's local timeline anchor
  const [selectedDate, setSelectedDate] = useState(new Date('2026-05-28T00:00:00Z'));
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  // Helper: check if two dates are the same day
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Helper: check if a date is "today" (system date)
  const isToday = (date) => {
    const today = new Date('2026-05-28T00:00:00Z'); // Lock to user scenario timeline
    return isSameDay(date, today);
  };

  // Navigate back
  const handlePrev = () => {
    const newDate = new Date(currentPivotDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentPivotDate(newDate);
  };

  // Navigate forward
  const handleNext = () => {
    const newDate = new Date(currentPivotDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentPivotDate(newDate);
  };

  // Reset to today
  const handleToday = () => {
    const today = new Date('2026-05-28T00:00:00Z');
    setCurrentPivotDate(today);
    setSelectedDate(today);
    if (setSelectedDateExternal) {
      setSelectedDateExternal(today);
    }
  };

  // Date selection click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (setSelectedDateExternal) {
      setSelectedDateExternal(date);
    }
  };

  // Get events on a target date
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      try {
        const estart = new Date(event.start_time);
        return isSameDay(estart, date);
      } catch (e) {
        return false;
      }
    });
  };

  // Calculate Grid for Month View (6 weeks = 42 cells)
  const generateMonthGrid = () => {
    const year = currentPivotDate.getFullYear();
    const month = currentPivotDate.getMonth();

    // Index of the 1st of the month (0 = Sun, 1 = Mon, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Total days in current month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Total days in previous month
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Prior Month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      cells.push({
        date: new Date(year, month - 1, dayNum),
        isCurrentMonth: false,
        dayNum,
      });
    }

    // Current Month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      cells.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
        dayNum: d,
      });
    }

    // Trailing Month days to fill exactly 42 standard cells
    const trailingCount = 42 - cells.length;
    for (let d = 1; d <= trailingCount; d++) {
      cells.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
        dayNum: d,
      });
    }

    return cells;
  };

  // Calculate Grid for Week View (7 days)
  const generateWeekGrid = () => {
    const sunday = new Date(currentPivotDate);
    const dayOfWeek = sunday.getDay();
    // Move to early Sunday morning
    sunday.setDate(sunday.getDate() - dayOfWeek);

    const cells = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      cells.push({
        date: d,
        isCurrentMonth: d.getMonth() === currentPivotDate.getMonth(),
        dayNum: d.getDate(),
      });
    }
    return cells;
  };

  const gridDays = viewMode === 'month' ? generateMonthGrid() : generateWeekGrid();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Current Month / Year formatted string
  const formatHeaderPeriod = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[currentPivotDate.getMonth()]} ${currentPivotDate.getFullYear()}`;
  };

  // Selected date events for details section
  const selectedDayEvents = getEventsForDate(selectedDate);

  const getEventBadgeStyles = (status) => {
    switch (status) {
      case 'SWAPPABLE':
        return 'bg-accent/20 text-accent border border-accent/20 hover:bg-accent/30';
      case 'SWAP_PENDING':
        return 'bg-warning/20 text-warning border border-warning/20 hover:bg-warning/35';
      default:
        return 'bg-white/5 text-[#888888] border border-white/5 hover:bg-white/10';
    }
  };

  const formatShortTime = (isoString) => {
    try {
      const d = new Date(isoString);
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${mins}`;
    } catch (e) {
      return '';
    }
  };
console.log("MY BACKEND EVENTS:", events);
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Calendar Header with navigation switches */}
      <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Indicators */}
        <div className="flex items-center gap-3">
          <div className="bg-bg-secondary p-1.5 rounded-lg border border-border flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 px-2 hover:bg-white/5 rounded text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold hover:bg-white/5 rounded text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1 px-2 hover:bg-white/5 rounded text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <h3 className="text-base font-bold text-text-primary min-w-35 text-center sm:text-left">
            {formatHeaderPeriod()}
          </h3>
        </div>

        {/* View togglers & Add trigger */}
        <div className="flex items-center gap-2">
          {/* Month / Week selection pills */}
          <div className="bg-bg-secondary p-1 rounded-lg border border-border flex items-center gap-1 text-xs">
            <button
              onClick={() => { setViewMode('month'); setCurrentPivotDate(new Date(selectedDate)); }}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-accent/25 text-accent border border-accent/25'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => { setViewMode('week'); setCurrentPivotDate(new Date(selectedDate)); }}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-accent/25 text-accent border border-accent/25'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => onCreateClick(selectedDate)}
            className="btn-primary hover:bg-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
          >
            <Plus size={13} />
            <span>Create Slot</span>
          </button>
        </div>
      </div>

      {/* Grid of Calendar calendar days */}
      <div className="bg-bg-card border border-border rounded-xl p-4 overflow-hidden shadow-card">
        {/* Days of week titles */}
        <div className="grid grid-cols-7 gap-1 text-center border-b border-border/65 pb-2 mb-2">
          {dayLabels.map((label, id) => (
            <div key={id} className="text-xs font-semibold text-text-secondary uppercase select-none tracking-wide text-center">
              {label}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1 bg-bg-card">
          {gridDays.map((cell, idx) => {
            const dateEvents = getEventsForDate(cell.date);
            const isSel = isSameDay(cell.date, selectedDate);
            const isTd = isToday(cell.date);
            
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(cell.date)}
                className={`min-h-26.25 max-h-35 p-2 rounded-lg border flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                  isSel 
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30' 
                    : isTd
                    ? 'border-cyan/50 bg-cyan/5'
                    : cell.isCurrentMonth
                    ? 'border-border/60 hover:border-text-secondary/35 bg-bg-secondary/30'
                    : 'border-border/15 bg-transparent opacity-30 hover:border-border/30'
                }`}
              >
                {/* Cell Number Header */}
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className={`text-xs font-bold leading-none ${
                      isTd 
                        ? 'text-cyan bg-cyan/15 px-1.5 py-0.5 rounded' 
                        : isSel 
                        ? 'text-accent' 
                        : 'text-text-primary'
                    }`}
                  >
                    {cell.dayNum}
                  </span>
                  
                  {dateEvents.length > 0 && (
                    <span className="text-[9px] font-semibold text-text-secondary px-1 bg-white/5 rounded select-none">
                      {dateEvents.length}
                    </span>
                  )}
                </div>

                {/* Minimized Event Pills */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden mt-1 pb-1">
                  {dateEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[9px] font-medium py-0.5 px-1.5 rounded truncate select-none transition-colors duration-150 flex items-center justify-between gap-1 ${getEventBadgeStyles(
                        ev.status
                      )}`}
                      title={`${ev.title} (${formatShortTime(ev.start_time)})`}
                    >
                      <span className="truncate flex-1">{ev.title}</span>
                      <span className="opacity-80 font-mono text-[8px] shrink-0">
                        {formatShortTime(ev.start_time)}
                      </span>
                    </div>
                  ))}
                  
                  {dateEvents.length > 3 && (
                    <div className="text-[8px] text-text-secondary text-right font-medium italic mt-0.5 pr-1">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Side-Bar / Detail Section */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-4 mb-4 gap-2">
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
              Daily Agenda Details
            </h4>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <CalendarIcon size={16} className="text-accent" />
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
          </div>
          
          <button
            onClick={() => onCreateClick(selectedDate)}
            className="text-xs font-semibold text-accent hover:text-accent-hover hover:underline flex items-center gap-1 cursor-pointer bg-accent/5 px-2.5 py-1.5 rounded-lg border border-accent/20"
          >
            <Plus size={12} />
            <span>Add Slot for This Day</span>
          </button>
        </div>

        {/* Selected Date slots listing */}
        {selectedDayEvents.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center text-text-secondary border border-dashed border-border/80 rounded-xl bg-bg-secondary/20">
            <span className="text-xs">No tasks or busy periods scheduled for this date.</span>
            <button
              onClick={() => onCreateClick(selectedDate)}
              className="mt-3 text-xs bg-accent/15 border border-accent/30 text-accent font-semibold px-3 py-1.5 rounded-md hover:bg-accent/25 transition-all cursor-pointer"
            >
              + Create Busy Slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDayEvents.map((event) => {
              const status = event.status || 'BUSY';
              return (
                <div 
                  key={event.id}
                  className="p-4 rounded-xl bg-bg-secondary/60 border border-border/90 flex flex-col justify-between hover:border-accent/40 transition-colors duration-150 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    status === 'SWAPPABLE' 
                      ? 'bg-accent' 
                      : status === 'SWAP_PENDING' 
                      ? 'bg-warning' 
                      : 'bg-text-secondary/40'
                  }`} />
                  
                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-bold text-text-primary text-sm truncate group-hover:text-accent transition-colors duration-150" title={event.title}>
                        {event.title}
                      </span>
                      <Badge status={status} className="scale-90 transform origin-right shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-text-secondary text-xs mb-3">
                      <Clock size={12} className="text-cyan" />
                      <span className="font-mono">{formatEventRange(event.start_time, event.end_time)}</span>
                    </div>
                  </div>

                  <div className="pl-2 pt-3 border-t border-border/30 flex items-center justify-between gap-2 mt-2">
                    {status === 'BUSY' ? (
                      <button
                        onClick={() => onMakeSwappable(event.id)}
                        className="flex items-center gap-1 bg-accent/10 hover:bg-accent/25 text-accent text-[11px] font-semibold py-1 px-2 rounded transition-all border border-accent/20 cursor-pointer"
                      >
                        <Globe size={11} />
                        <span>Share on Marketplace</span>
                      </button>
                    ) : status === 'SWAPPABLE' ? (
                      <div className="flex items-center gap-1 text-[11px] text-accent font-medium">
                        <Sparkles size={11} className="animate-pulse" />
                        <span>Public Swappable</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-warning font-medium">
                        <Clock size={11} />
                        <span>Proposal Pending</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel the event "${event.title}"?`)) {
                          onDelete(event.id);
                        }
                      }}
                      className="p-1 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-all cursor-pointer"
                      title="Decline/Delete slot"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;

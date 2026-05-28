/**
 * SLOTS_WAPPER DOMAIN TYPES (Contract Reference)
 * Use these types to align backend responses and database schema representations.
 */

export type EventStatus = 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CalendarEvent {
  id: number;
  user_id: number;
  title: string;
  start_time: string; // ISO-8601 String representation, eg. "2026-05-28T10:00:00Z"
  end_time: string;   // ISO-8601 String representation, eg. "2026-05-28T11:00:00Z"
  status: EventStatus;
  created_at?: string;
}

export type SwapRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface SwapRequest {
  id: number;
  requester_id: number;
  responder_id: number;
  requester_slot_id: number;
  responder_slot_id: number;
  status: SwapRequestStatus;
  created_at?: string;
  
  // Joins
  requester_name?: string;
  responder_name?: string;
  requester_slot?: Partial<CalendarEvent>;
  responder_slot?: Partial<CalendarEvent>;
}

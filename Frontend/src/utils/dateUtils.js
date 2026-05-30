import { format, parseISO, isValid } from 'date-fns';

/**
 * Safely parses a date string or object into a valid Date instance.
 * Handles standard ISO, timezone offsets (+05:30), and sanitizes malformed backend dates.
 */
const safeParseDate = (dateVal) => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  
  // 1. SANITIZE: Strip rogue 'Z' if it follows a timezone offset (e.g., +05:30Z -> +05:30)
  let cleanVal = dateVal;
  if (typeof dateVal === 'string') {
    cleanVal = dateVal.replace(/([+-]\d{2}:\d{2})Z$/, '$1');
  }
  
  // 2. Try native parsing first as it's more resilient with modern timezone offsets
  const nativeParsed = new Date(cleanVal);
  if (!isNaN(nativeParsed.getTime())) return nativeParsed;
  
  // 3. Fallback to date-fns parseISO
  return typeof cleanVal === 'string' ? parseISO(cleanVal) : new Date(cleanVal);
};

/**
 * Formats an ISO datetime string into a human-readable local format.
 * Example: '2026-05-28T08:45:00' -> 'May 28, 2026 08:45 AM'
 */
export const formatDateTime = (dateString) => {
  try {
    const date = safeParseDate(dateString);
    if (!date || !isValid(date)) return 'Invalid Date';
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Formats start and end times into a clean range.
 * Example: 'May 28, 2026 (8:00 AM - 9:00 AM)'
 */
export const formatEventRange = (startTime, endTime) => {
  try {
    const start = safeParseDate(startTime);
    const end = safeParseDate(endTime);
    
    if (!start || !end || !isValid(start) || !isValid(end)) return 'Invalid Range';
    
    const startDateStr = format(start, 'MMM d, yyyy');
    const endDateStr = format(end, 'MMM d, yyyy');
    
    const startTimeStr = format(start, 'h:mm a');
    const endTimeStr = format(end, 'h:mm a');
    
    if (startDateStr === endDateStr) {
      return `${startDateStr} (${startTimeStr} - ${endTimeStr})`;
    } else {
      return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'MMM d, h:mm a')}`;
    }
  } catch (error) {
    return 'Invalid Range';
  }
};

/**
 * Formats a date format for HTML datetime-local input fields (YYYY-MM-DDTHH:MM)
 */
export const formatForInput = (date) => {
  if (!date) return '';
  const d = safeParseDate(date);
  if (!d || isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // FIXED: HTML datetime-local fields strictly require a COLON between hours and minutes
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
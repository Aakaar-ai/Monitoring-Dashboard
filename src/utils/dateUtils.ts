import { format, isToday, isYesterday, formatDistanceToNow, isValid } from 'date-fns';

export const formatLogTimestamp = (timestamp: string): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  
  // Check if the date is valid
  if (!isValid(date)) {
    console.warn('Invalid timestamp:', timestamp);
    return 'Invalid Date';
  }
  
  try {
    if (isToday(date)) {
      return format(date, 'HH:mm:ss.SSS');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm:ss')}`;
    } else {
      return format(date, 'MMM dd HH:mm:ss');
    }
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error);
    return 'Format Error';
  }
};

export const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', timestamp, error);
    return 'Format Error';
  }
};

export const formatDateForInput = (date: Date): string => {
  if (!date || !isValid(date)) {
    return '';
  }
  
  try {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error formatting date for input:', date, error);
    return '';
  }
};

export const parseInputDate = (dateString: string): Date => {
  if (!dateString) {
    return new Date();
  }
  
  const date = new Date(dateString);
  
  if (!isValid(date)) {
    console.warn('Invalid date string:', dateString);
    return new Date();
  }
  
  return date;
};

export const isValidTimestamp = (timestamp: string): boolean => {
  if (!timestamp) return false;
  
  const date = new Date(timestamp);
  return isValid(date);
};
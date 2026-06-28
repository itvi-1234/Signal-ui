import { format, isToday, isYesterday } from 'date-fns';

export function formatMessageTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'h:mm a');
}

export function formatConversationTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MM/dd/yy');
}

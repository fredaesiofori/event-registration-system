export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  password?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'Conference' | 'Workshop' | 'Meetup' | 'Webinar' | 'Concert';
  date: string; // ISO string or formatted date
  time: string;
  location: string;
  price: number; // 0 for free
  capacity: number;
  registeredCount: number;
  imageUrl: string;
  gradient: string;
  featured?: boolean;
  speakerName?: string;
  speakerRole?: string;
}

export interface Ticket {
  id: string; // Unique ticket code like EVT-2026-8921
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketType: 'Standard' | 'VIP' | 'Virtual Access';
  pricePaid: number;
  registeredAt: string;
  qrData: string;
  status: 'valid' | 'checked-in' | 'cancelled';
}

export type ThemeMode = 'dark' | 'light' | 'system';

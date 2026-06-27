import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventItem, Ticket, User, UserRole, ThemeMode } from '../types';
import { SEED_EVENTS, SEED_TICKETS, SEED_USERS } from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: EventItem[];
  tickets: Ticket[];
  activeTab: 'browse' | 'mytickets' | 'admin' | 'profile';
  setActiveTab: (tab: 'browse' | 'mytickets' | 'admin' | 'profile') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  
  // Auth actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string, phone: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (name: string, phone: string, avatar: string) => void;
  
  // Event actions
  createEvent: (event: Omit<EventItem, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  
  // Registration actions
  registerForEvent: (eventId: string, attendeeInfo: { name: string; email: string; phone: string; ticketType: 'Standard' | 'VIP' | 'Virtual Access' }) => Ticket;
  cancelTicket: (ticketId: string) => void;
  checkInTicket: (ticketId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eventapp_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eventapp_current_user');
    return saved ? JSON.parse(saved) : null; // Start logged out for real app feel
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('eventapp_events');
    return saved ? JSON.parse(saved) : SEED_EVENTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('eventapp_tickets');
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'mytickets' | 'admin' | 'profile'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('eventapp_theme');
    return (saved as ThemeMode) || 'system';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('eventapp_theme', mode);
  };

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('eventapp_users', JSON.stringify(users));
  }, [users]);

  // Sync events to localStorage
  useEffect(() => {
    localStorage.setItem('eventapp_events', JSON.stringify(events));
  }, [events]);

  // Sync tickets to localStorage
  useEffect(() => {
    localStorage.setItem('eventapp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eventapp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eventapp_current_user');
    }
  }, [currentUser]);

  // Theme Toggler effect
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (resolvedTheme: 'dark' | 'light') => {
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Auth actions
  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'Account not found. Please sign up.' };
    }
    if (found.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    setCurrentUser(found);
    if (found.role === 'admin') setActiveTab('admin');
    else setActiveTab('browse');
    return { success: true };
  };

  const signUp = (name: string, email: string, password: string, phone: string, role: UserRole) => {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`, // placeholder profile
      password
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    if (role === 'admin') setActiveTab('admin');
    else setActiveTab('browse');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('browse');
  };

  const updateProfile = (name: string, phone: string, avatar: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, phone, avatar };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  // Event CRUD
  const createEvent = (newEvt: Omit<EventItem, 'id' | 'registeredCount'>) => {
    const created: EventItem = {
      ...newEvt,
      id: `evt-${Date.now()}`,
      registeredCount: 0
    };
    setEvents(prev => [created, ...prev]);
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setTickets(prev => prev.filter(t => t.eventId !== id));
  };

  // Registration
  const registerForEvent = (eventId: string, info: { name: string; email: string; phone: string; ticketType: 'Standard' | 'VIP' | 'Virtual Access' }): Ticket => {
    const evt = events.find(e => e.id === eventId);
    if (!evt) throw new Error('Event not found');

    const ticketCode = `EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      id: ticketCode,
      eventId: evt.id,
      eventTitle: evt.title,
      eventDate: evt.date,
      eventTime: evt.time,
      eventLocation: evt.location,
      userId: currentUser?.id || 'guest',
      attendeeName: info.name,
      attendeeEmail: info.email,
      attendeePhone: info.phone,
      ticketType: info.ticketType,
      pricePaid: info.ticketType === 'VIP' ? Math.round(evt.price * 1.5) : evt.price,
      registeredAt: new Date().toISOString(),
      qrData: `${ticketCode}|${evt.id}|${currentUser?.id || 'guest'}`,
      status: 'valid'
    };

    setTickets(prev => [newTicket, ...prev]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6']
      });
    } catch {
      // Ignore confetti issues
    }

    return newTicket;
  };

  const cancelTicket = (ticketId: string) => {
    const target = tickets.find(t => t.id === ticketId);
    if (!target) return;

    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'cancelled' } : t));
    setEvents(prev => prev.map(e => e.id === target.eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e));
  };

  const checkInTicket = (ticketId: string): boolean => {
    const target = tickets.find(t => t.id.toLowerCase() === ticketId.toLowerCase() || t.qrData.includes(ticketId));
    if (!target || target.status === 'cancelled') return false;

    setTickets(prev => prev.map(t => t.id === target.id ? { ...t, status: 'checked-in' } : t));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        events,
        tickets,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        theme,
        setTheme,
        login,
        signUp,
        logout,
        updateProfile,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelTicket,
        checkInTicket
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

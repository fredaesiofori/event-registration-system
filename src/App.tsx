import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { EventCard } from './components/EventCard';
import { MyTicketsView } from './components/MyTicketsView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { AuthModal } from './components/AuthModal';
import { RegisterModal } from './components/RegisterModal';
import { TicketModal } from './components/TicketModal';
import { EventItem, Ticket } from './types';
import { Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { events, activeTab, setActiveTab, selectedCategory, setSelectedCategory, searchQuery, currentUser, tickets, cancelTicket } = useApp();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedEventForReg, setSelectedEventForReg] = useState<EventItem | null>(null);
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<Ticket | null>(null);

  const categories = ['All', 'Conference', 'Workshop', 'Meetup', 'Webinar', 'Concert'];

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.speakerName && e.speakerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-650/5 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-650/5 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'browse' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-r from-indigo-100/70 via-purple-50/50 to-slate-100 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-slate-900/50 border border-slate-200 dark:border-white/10 p-8 sm:p-12 overflow-hidden mb-12 shadow-lg dark:shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-250 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-mono mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> NextGen Event Platform
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Discover & Book Professional Tech Conferences
                </h1>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-4 leading-relaxed max-w-2xl">
                  Seamless event registrations with verified secure QR boarding passes, live PDF exports, and real-time dashboard tracking.
                </p>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-8 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                        : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="hidden sm:block text-xs font-mono text-slate-500 shrink-0">
                {filteredEvents.length} events matching
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-8 max-w-md mx-auto my-8">
                <Sparkles className="w-12 h-12 text-slate-450 dark:text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Events</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Try adjusting your search query or selecting a different category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEvents.map(event => {
                  const isUserBooked = tickets.some(t => t.eventId === event.id && t.userId === currentUser?.id && t.status !== 'cancelled');

                  return (
                    <EventCard
                      key={event.id}
                      event={event}
                      isRegistered={isUserBooked}
                      onRegisterClick={(evt) => {
                        if (isUserBooked) {
                          const userTicket = tickets.find(t => t.eventId === evt.id && t.userId === currentUser?.id && t.status !== 'cancelled');
                          if (userTicket) setSelectedTicketForModal(userTicket);
                        } else {
                          if (!currentUser) {
                            setIsAuthOpen(true);
                          } else {
                            setSelectedEventForReg(evt);
                          }
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {activeTab === 'mytickets' && (
          currentUser ? (
            <MyTicketsView
              onSelectTicket={(t) => setSelectedTicketForModal(t)}
              onBrowseClick={() => setActiveTab('browse')}
            />
          ) : (
            <div className="max-w-md mx-auto my-24 p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl">
              <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Access Your Tickets</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Please sign in to view your registered tickets, download PDF passes, and verify check-in status.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-all"
              >
                Sign In
              </button>
            </div>
          )
        )}

        {activeTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-24 p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl">
              <p className="text-slate-600 dark:text-slate-400">Access Denied. Organizer clearance required.</p>
            </div>
          )
        )}

        {activeTab === 'profile' && (
          <ProfileSettings />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-300">EventApp</span>
            <span>• Verified Ticketing & Registration</span>
          </div>
          <p className="font-mono text-[11px] text-slate-400 dark:text-slate-600">React • Tailwind CSS • LocalStorage DB</p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <RegisterModal
        event={selectedEventForReg}
        onClose={() => setSelectedEventForReg(null)}
        onViewTicket={(t) => setSelectedTicketForModal(t)}
      />

      <TicketModal
        ticket={selectedTicketForModal}
        onClose={() => setSelectedTicketForModal(null)}
        onCancelTicket={(id) => cancelTicket(id)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

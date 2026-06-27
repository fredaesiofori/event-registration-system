import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket as TicketIcon, QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { Ticket } from '../types';

export const MyTicketsView: React.FC<{ onSelectTicket: (t: Ticket) => void; onBrowseClick: () => void }> = ({ onSelectTicket, onBrowseClick }) => {
  const { currentUser, tickets } = useApp();
  const [filter, setFilter] = useState<'all' | 'valid' | 'checked-in' | 'cancelled'>('all');

  const myTickets = tickets.filter(t => t.userId === currentUser?.id || t.attendeeEmail.toLowerCase() === currentUser?.email.toLowerCase());
  
  const filteredTickets = filter === 'all' 
    ? myTickets 
    : myTickets.filter(t => t.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-mono text-xs uppercase tracking-wider mb-1">
            <TicketIcon className="w-4 h-4" />
            <span>Attendee Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Registered Tickets</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Access your QR boarding passes, verify status, and download PDF copies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 self-start md:self-auto">
          {(['all', 'valid', 'checked-in', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === s
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {s} {s === 'all' ? `(${myTickets.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {filter !== 'all' 
              ? `You don't have any tickets with status "${filter}".` 
              : "You haven't registered for any upcoming conferences or masterclasses yet."}
          </p>
          <button
            onClick={onBrowseClick}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <span>Explore Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((t) => {
            const isCancelled = t.status === 'cancelled';
            const isCheckedIn = t.status === 'checked-in';

            return (
              <div
                key={t.id}
                onClick={() => onSelectTicket(t)}
                className="group relative rounded-3xl bg-slate-50 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-purple-600 dark:hover:border-purple-500/40 p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {t.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                      isCancelled ? 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' :
                      isCheckedIn ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' :
                      'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-2">
                    {t.eventTitle}
                  </h3>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">🗓 {t.eventDate} • {t.eventTime}</p>
                    <p className="text-slate-500 dark:text-slate-400 truncate">📍 {t.eventLocation}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block">Pass Tier</span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> {t.ticketType}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 group-hover:bg-purple-600 group-hover:text-white text-slate-700 dark:text-white transition-all">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

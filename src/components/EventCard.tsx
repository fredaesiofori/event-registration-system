import React from 'react';
import { EventItem } from '../types';
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';

export const EventCard: React.FC<{
  event: EventItem;
  onRegisterClick: (event: EventItem) => void;
  isRegistered?: boolean;
}> = ({ event, onRegisterClick, isRegistered }) => {
  const soldOut = event.registeredCount >= event.capacity;
  const progressPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group relative rounded-3xl bg-slate-50 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99] overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 animate-fade-in-up">
      
      {/* Glow highlight on hover */}
      <div className="absolute inset-px bg-gradient-to-b from-slate-200/50 dark:from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />

      {/* Image & Gradient Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} mix-blend-multiply opacity-60 dark:opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-950 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-white/15 text-[11px] font-mono text-slate-800 dark:text-slate-200 uppercase tracking-wider shadow-md">
            {event.category}
          </span>
          {event.featured && (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-lg">
          {event.price === 0 ? 'FREE' : `$${event.price}`}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between relative z-10 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Date & Location */}
        <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(event.date)}</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400 truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="truncate text-slate-600 dark:text-slate-300">{event.location}</span>
          </div>
        </div>

        {/* Speaker Preview (if available) */}
        {event.speakerName && (
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-350/10 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping" />
            <span className="text-slate-500 dark:text-slate-400">Speaker:</span>
            <span className="font-bold text-slate-900 dark:text-white truncate">{event.speakerName}</span>
          </div>
        )}

        {/* Capacity & Actions */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{event.registeredCount} / {event.capacity} Registered</span>
            </span>
            <span className={soldOut ? 'text-rose-600 dark:text-rose-400 font-bold' : progressPercent > 85 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500'}>
              {soldOut ? 'Sold Out' : `${100 - progressPercent}% Left`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-4 border border-slate-350/5 dark:border-transparent">
            <div
              className={`h-full transition-all duration-500 ${
                soldOut ? 'bg-rose-500' : progressPercent > 85 ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={() => onRegisterClick(event)}
            disabled={soldOut && !isRegistered}
            className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isRegistered
                ? 'bg-purple-600/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-600/20'
                : soldOut
                ? 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/5'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            <span>{isRegistered ? 'View My Ticket' : soldOut ? 'Registration Closed' : 'Register Now'}</span>
            {!soldOut && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>

      </div>
    </div>
  );
};

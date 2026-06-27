import React, { useState } from 'react';
import { EventItem, Ticket } from '../types';
import { useApp } from '../context/AppContext';
import { X, Calendar, MapPin, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const RegisterModal: React.FC<{
  event: EventItem | null;
  onClose: () => void;
  onViewTicket: (ticket: Ticket) => void;
}> = ({ event, onClose, onViewTicket }) => {
  const { currentUser, registerForEvent } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [ticketType, setTicketType] = useState<'Standard' | 'VIP' | 'Virtual Access'>('Standard');
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const ticket = registerForEvent(event.id, {
        name,
        email,
        phone,
        ticketType
      });
      setConfirmedTicket(ticket);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const calculatedPrice = ticketType === 'VIP' ? Math.round(event.price * 1.5) : ticketType === 'Virtual Access' ? 0 : event.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100">
        
        {/* Header (Dynamic Colored) */}
        <div className={`p-6 bg-gradient-to-r ${event.gradient} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="px-2.5 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider mb-2 inline-block">
            {event.category} Registration
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight pr-8">{event.title}</h3>
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-white/90">
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5" /> {event.date}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" /> {event.location.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-900">
          {confirmedTicket ? (
            /* SUCCESS STATE */
            <div className="text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">You're Registered!</h4>
              <p className="text-xs text-slate-655 dark:text-slate-400 mt-1">
                A verification copy has been sent to <span className="text-slate-900 dark:text-white font-medium">{confirmedTicket.attendeeEmail}</span>
              </p>

              {/* QR Boarding Preview */}
              <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 inline-block shadow-inner">
                <div className="bg-white p-3 rounded-xl inline-block mb-2 shadow-sm border border-slate-200 dark:border-transparent">
                  <QRCodeSVG value={confirmedTicket.qrData} size={140} level="H" />
                </div>
                <div className="text-[11px] font-mono text-indigo-650 dark:text-indigo-400 font-bold tracking-widest">{confirmedTicket.id}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{confirmedTicket.ticketType} PASS</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewTicket(confirmedTicket);
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Admission & PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                >
                  Back to Events
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Ticket Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-655 dark:text-slate-350 mb-2 font-mono uppercase tracking-wider">Select Pass Tier</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTicketType('Standard')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      ticketType === 'Standard'
                        ? 'bg-indigo-600/10 dark:bg-indigo-600/15 border-indigo-500 text-indigo-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Standard</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">In-person entry</div>
                    </div>
                    <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
                      {event.price === 0 ? 'FREE' : `$${event.price}`}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTicketType('VIP')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      ticketType === 'VIP'
                        ? 'bg-purple-600/10 dark:bg-purple-600/15 border-purple-500 text-purple-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">VIP Access</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Front rows & lounge</div>
                    </div>
                    <div className="text-sm font-extrabold text-purple-600 dark:text-purple-400 mt-2">
                      {event.price === 0 ? 'FREE' : `$${Math.round(event.price * 1.5)}`}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTicketType('Virtual Access')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      ticketType === 'Virtual Access'
                        ? 'bg-pink-600/10 dark:bg-pink-600/15 border-pink-500 text-pink-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Virtual Stream</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Live HD broadcast</div>
                    </div>
                    <div className="text-sm font-extrabold text-pink-650 dark:text-pink-400 mt-2">
                      FREE
                    </div>
                  </button>
                </div>
              </div>

              {/* Attendee Contact Info */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">Attendee Information</label>
                
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-955 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Phone Number (for entry confirmation)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-955 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Price Summary & Submit */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Due</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {calculatedPrice === 0 ? 'FREE' : `$${calculatedPrice}`}
                  </span>
                </div>

                <button
                  type="submit"
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <span>Confirm Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

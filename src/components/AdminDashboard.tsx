import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit3, Trash2, Users, DollarSign, Calendar, Search, CheckCircle2, XCircle, Sparkles, X, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { EventItem, Ticket } from '../types';

export const AdminDashboard: React.FC = () => {
  const { events, tickets, createEvent, updateEvent, deleteEvent, checkInTicket, cancelTicket } = useApp();

  const [adminTab, setAdminTab] = useState<'events' | 'attendees' | 'analytics'>('events');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Attendee search & filter
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeEventFilter, setAttendeeEventFilter] = useState('ALL');

  // Form states for Create/Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'Conference' | 'Workshop' | 'Meetup' | 'Webinar' | 'Concert'>('Conference');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('09:00 AM - 05:00 PM');
  const [formLoc, setFormLoc] = useState('');
  const [formPrice, setFormPrice] = useState(99);
  const [formCap, setFormCap] = useState(250);
  const [formImg, setFormImg] = useState('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80');
  const [formSpeakerName, setFormSpeakerName] = useState('');
  const [formSpeakerRole, setFormSpeakerRole] = useState('');

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('Conference');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('09:00 AM - 05:00 PM');
    setFormLoc('Convention Center, San Francisco');
    setFormPrice(99);
    setFormCap(250);
    setFormImg('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80');
    setFormSpeakerName('');
    setFormSpeakerRole('');
    setShowEventModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormDesc(evt.description);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLoc(evt.location);
    setFormPrice(evt.price);
    setFormCap(evt.capacity);
    setFormImg(evt.imageUrl);
    setFormSpeakerName(evt.speakerName || '');
    setFormSpeakerRole(evt.speakerRole || '');
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formLoc) return;

    const gradients = [
      'from-violet-600 via-indigo-600 to-purple-800',
      'from-pink-500 via-rose-600 to-amber-600',
      'from-cyan-500 via-blue-600 to-indigo-700',
      'from-blue-500 via-teal-500 to-emerald-600',
      'from-amber-500 via-orange-600 to-red-600'
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: formTitle,
        description: formDesc,
        category: formCategory,
        date: formDate,
        time: formTime,
        location: formLoc,
        price: Number(formPrice),
        capacity: Number(formCap),
        imageUrl: formImg,
        speakerName: formSpeakerName,
        speakerRole: formSpeakerRole
      });
    } else {
      createEvent({
        title: formTitle,
        description: formDesc,
        category: formCategory,
        date: formDate,
        time: formTime,
        location: formLoc,
        price: Number(formPrice),
        capacity: Number(formCap),
        imageUrl: formImg,
        gradient: randomGrad,
        featured: false,
        speakerName: formSpeakerName,
        speakerRole: formSpeakerRole
      });
    }
    setShowEventModal(false);
  };

  // KPI Calculations
  const validTickets = tickets.filter(t => t.status !== 'cancelled');
  const totalRevenue = validTickets.reduce((sum, t) => sum + t.pricePaid, 0);
  const totalRegistrations = validTickets.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
  const checkedInCount = tickets.filter(t => t.status === 'checked-in').length;

  // Filtered attendees for table
  const filteredAttendees = tickets.filter(t => {
    const matchesSearch = t.attendeeName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      t.attendeeEmail.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(attendeeSearch.toLowerCase());
    const matchesEvent = attendeeEventFilter === 'ALL' || t.eventId === attendeeEventFilter;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 text-slate-900 dark:text-slate-100">
      
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Event Management Console</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organizer Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage conferences, monitor live attendee check-ins, and track registration metrics.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-550 dark:text-slate-400 tracking-wider">Total Ticket Revenue</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 inline-flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" /> Real-time invoice ledger
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-550 dark:text-slate-400 tracking-wider">Total Registrations</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{totalRegistrations}</p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-300 mt-2 block font-mono">
            Across {events.length} active events
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-550 dark:text-slate-400 tracking-wider">Checked-In Attendees</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{checkedInCount}</p>
          <span className="text-[10px] text-purple-600 dark:text-purple-300 mt-2 block font-mono">
            {totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0}% Check-in Rate
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-550 dark:text-slate-400 tracking-wider">Capacity Utilization</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{overallOccupancy}%</p>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${overallOccupancy}%` }} />
          </div>
        </div>
      </div>

      {/* Admin Tabs Switcher */}
      <div className="flex border-b border-slate-250 dark:border-white/10 mb-6 space-x-6">
        <button
          onClick={() => setAdminTab('events')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            adminTab === 'events' ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          📅 Manage Events ({events.length})
        </button>

        <button
          onClick={() => setAdminTab('attendees')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            adminTab === 'attendees' ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          👥 Registered Attendees ({tickets.length})
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            adminTab === 'analytics' ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          📊 Event Analytics
        </button>
      </div>

      {/* TAB 1: MANAGE EVENTS */}
      {adminTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl">
              <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No events created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
              {events.map(evt => {
                const soldOut = evt.registeredCount >= evt.capacity;
                const occ = Math.round((evt.registeredCount / evt.capacity) * 100);

                return (
                  <div key={evt.id} className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between hover:border-slate-355 dark:hover:border-white/20 transition-all shadow-md">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px] font-mono uppercase text-indigo-750 dark:text-indigo-300 font-bold">
                          {evt.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${evt.title}"? This will cancel all bookings.`)) deleteEvent(evt.id);
                            }}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">{evt.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">📍 {evt.location} • {evt.date}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Ticket Price: </span>
                        <span className="font-bold text-slate-900 dark:text-white">{evt.price === 0 ? 'FREE' : `$${evt.price}`}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-black ${soldOut ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-300'}`}>
                          {evt.registeredCount} / {evt.capacity} ({occ}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTERED ATTENDEES TABLE */}
      {adminTab === 'attendees' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, ticket ID..."
                value={attendeeSearch}
                onChange={e => setAttendeeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">Filter Event:</span>
              <select
                value={attendeeEventFilter}
                onChange={e => setAttendeeEventFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Events ({tickets.length})</option>
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title.substring(0, 30)}... ({e.registeredCount})</option>
                ))}
              </select>
            </div>

          </div>

          {/* Table */}
          <div className="rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-white/5 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="py-3.5 px-4">Ticket Code</th>
                    <th className="py-3.5 px-4">Attendee Name</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Contact Phone</th>
                    <th className="py-3.5 px-4">Event Booked</th>
                    <th className="py-3.5 px-4">Tier</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {filteredAttendees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                        No attendees match your query filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendees.map(t => (
                      <tr key={t.id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{t.attendeeName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-500 truncate max-w-[140px]">{t.attendeeEmail}</div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell text-slate-655 dark:text-slate-400">{t.attendeePhone}</td>
                        <td className="py-3 px-4 truncate max-w-[180px] font-semibold text-slate-800 dark:text-slate-250">{t.eventTitle}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 text-[10px] font-bold">
                            {t.ticketType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            t.status === 'cancelled' ? 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400' :
                            t.status === 'checked-in' ? 'bg-emerald-500/10 text-emerald-705 dark:bg-emerald-500/15 dark:text-emerald-400' :
                            'bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {t.status === 'valid' && (
                            <button
                              onClick={() => checkInTicket(t.id)}
                              className="px-2.5 py-1 rounded bg-emerald-500 text-white dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 text-[10px] font-bold transition-all shadow-sm"
                            >
                              Check In
                            </button>
                          )}
                          {t.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Revoke admission for ${t.attendeeName}?`)) cancelTicket(t.id);
                              }}
                              className="p-1 rounded hover:bg-rose-500/15 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all inline-block"
                              title="Cancel Ticket"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVENT TRACKING & ANALYTICS */}
      {adminTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Registration Velocity & Income</h3>
            
            <div className="space-y-5">
              {events.map(evt => {
                const percent = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                const rev = evt.registeredCount * evt.price;

                return (
                  <div key={evt.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-white truncate max-w-md">{evt.title}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {evt.registeredCount} / {evt.capacity} attendees • <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">${rev.toLocaleString()}</span>
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-200 border border-slate-300 dark:bg-white/5 dark:border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {editingEvent ? '✏️ Edit Event Configuration' : '➕ Provision New Event'}
            </h2>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. NextGen Web Summit 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Brief overview of keynote sessions and workshops..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Concert">Concert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Schedule Time</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={formLoc}
                    onChange={e => setFormLoc(e.target.value)}
                    placeholder="Moscone Center, SF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Ticket Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={formCap}
                    onChange={e => setFormCap(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Keynote Speaker (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formSpeakerName}
                    onChange={e => setFormSpeakerName(e.target.value)}
                    placeholder="Speaker Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formSpeakerRole}
                    onChange={e => setFormSpeakerRole(e.target.value)}
                    placeholder="Speaker Title / Role"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formImg}
                  onChange={e => setFormImg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-550 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-955 font-bold shadow-lg shadow-amber-500/20"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

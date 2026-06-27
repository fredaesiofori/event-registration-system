import React from 'react';
import { Ticket } from '../types';
import { X, Download, Calendar, MapPin, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

export const TicketModal: React.FC<{
  ticket: Ticket | null;
  onClose: () => void;
  onCancelTicket?: (id: string) => void;
}> = ({ ticket, onClose, onCancelTicket }) => {
  if (!ticket) return null;

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [180, 85]
    });

    // Dark sleek background
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 180, 85, 'F');

    // Accent header strip
    doc.setFillColor(99, 102, 241); // Indigo 500
    doc.rect(0, 0, 180, 8, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTPASS OFFICIAL ADMISSION', 12, 18);

    doc.setFontSize(14);
    doc.setTextColor(199, 210, 254); // Indigo 200
    const titleLines = doc.splitTextToSize(ticket.eventTitle, 110);
    doc.text(titleLines, 12, 28);

    // Attendee info
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('ATTENDEE NAME', 12, 45);
    doc.text('PASS TIER', 75, 45);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(ticket.attendeeName.toUpperCase(), 12, 51);
    doc.text(ticket.ticketType.toUpperCase(), 75, 51);

    // Date & Location
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('DATE & TIME', 12, 63);
    doc.text('LOCATION', 75, 63);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${ticket.eventDate} | ${ticket.eventTime}`, 12, 69);
    const locLines = doc.splitTextToSize(ticket.eventLocation, 60);
    doc.text(locLines, 75, 69);

    // Separator dashed line
    doc.setDrawColor(51, 65, 85);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(140, 10, 140, 75);

    // Right stub section
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('courier', 'bold');
    doc.text(ticket.id, 145, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('STATUS: ' + ticket.status.toUpperCase(), 145, 28);

    // Draw QR placeholder box explanation or link
    doc.setFillColor(255, 255, 255);
    doc.rect(145, 33, 28, 28, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text('VERIFIED QR', 148, 48);

    doc.setFontSize(8);
    doc.setTextColor(99, 102, 241);
    doc.text('Powered by EventApp', 144, 75);

    doc.save(`${ticket.id}-Ticket.pdf`);
  };

  const isCancelled = ticket.status === 'cancelled';
  const isCheckedIn = ticket.status === 'checked-in';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 z-20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Boarding Pass Ticket UI */}
        <div className="p-6 sm:p-8">
          
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-indigo-650 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Admission Pass
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase font-mono ${
              isCancelled ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
              isCheckedIn ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
              'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
            }`}>
              {ticket.status}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {ticket.eventTitle}
          </h3>

          {/* Ticket Perforated Card Container */}
          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-5 sm:p-6 relative overflow-hidden shadow-inner">
            
            {/* Perforation Cutouts */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <p className="text-[10px] font-mono uppercase text-slate-450 dark:text-slate-500 tracking-wider">Registered Attendee</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate">{ticket.attendeeName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{ticket.attendeeEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-white/5">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-450 dark:text-slate-500 tracking-wider">Pass Tier</p>
                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{ticket.ticketType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-slate-450 dark:text-slate-500 tracking-wider">Price Paid</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{ticket.pricePaid === 0 ? 'FREE' : `$${ticket.pricePaid}`}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{ticket.eventDate} • {ticket.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-650 dark:text-purple-400 shrink-0" />
                    <span className="truncate">{ticket.eventLocation}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Column */}
              <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10 pt-4 sm:pt-0 sm:pl-4">
                <div className="p-3 bg-white rounded-xl shadow-lg relative group border border-slate-200 dark:border-transparent">
                  <QRCodeSVG value={ticket.qrData} size={110} level="H" />
                  {isCheckedIn && (
                    <div className="absolute inset-0 bg-emerald-950/80 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
                    </div>
                  )}
                </div>
                <span className="mt-2 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-300 tracking-widest">{ticket.id}</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-550 uppercase">Scan at Entrance</span>
              </div>

            </div>

          </div>

          {/* Warnings or Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadPDF}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Admission Pass</span>
            </button>

            {!isCancelled && onCancelTicket && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this ticket? The space will be released.')) {
                    onCancelTicket(ticket.id);
                    onClose();
                  }
                }}
                className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Cancel Ticket</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

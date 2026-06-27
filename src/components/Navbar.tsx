import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, Calendar, ShieldCheck, Search, LogIn, LogOut, UserCheck, Sparkles, Sun, Moon, Laptop } from 'lucide-react';

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { currentUser, activeTab, setActiveTab, searchQuery, setSearchQuery, logout, tickets, theme, setTheme } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const myValidTicketsCount = tickets.filter(t => t.userId === currentUser?.id && t.status !== 'cancelled').length;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
              EventApp
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              PRO
            </span>
          </div>
        </div>

        {/* Search Bar (Only shown on browse tab) */}
        {activeTab === 'browse' && (
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conferences, workshops, speakers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Explore Events</span>
          </button>

          <button
            onClick={() => setActiveTab('mytickets')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all relative ${
              activeTab === 'mytickets'
                ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">My Tickets</span>
            {myValidTicketsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[11px] font-bold flex items-center justify-center">
                {myValidTicketsCount}
              </span>
            )}
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 shadow-sm'
                  : 'text-amber-600 dark:text-amber-400/80 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-500/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Admin Panel</span>
            </button>
          )}
        </nav>

        {/* User Profile / Auth Actions */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-white/10 pl-3 sm:pl-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/20"
                />
                <div className="hidden md:block leading-tight">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400">{currentUser.role === 'admin' ? 'Organizer' : 'Attendee'}</div>
                </div>
              </button>

              {/* Profile Settings & Theme Selector Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">Signed In As</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{currentUser.email}</p>
                  </div>

                  {/* Profile Settings */}
                  <div className="px-2 mb-2">
                    <button
                      onClick={() => { setActiveTab('profile'); setShowRoleDropdown(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left font-semibold"
                    >
                      👤 Account Settings
                    </button>
                  </div>

                  {/* Theme Selector */}
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono mb-2">Theme Mode</p>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          theme === 'light'
                            ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          theme === 'dark'
                            ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          theme === 'system'
                            ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Sys</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/5 mt-2.5 pt-1.5 px-2">
                    <button
                      onClick={() => { logout(); setShowRoleDropdown(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/25"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Image, CheckCircle, Shield, Sparkles } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl">
        <p className="text-slate-500 dark:text-slate-400">Please sign in to access settings.</p>
      </div>
    );
  }

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, phone, avatar);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    setAvatar(newAvatar);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Account Customization</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your name, contact phone, and avatar identifier.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-550/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {/* Main Panel */}
      <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200 dark:border-white/5">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md bg-slate-200 dark:bg-slate-900"
            />
            
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Avatar Image Link</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter a direct image URL, or generate a random bot avatar.</p>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="py-1.5 px-3 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-600/20 transition-all border border-indigo-250 dark:border-transparent"
              >
                🤖 Generate Bot Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-350 font-semibold mb-1.5">Email Address (Read-only)</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-950/60 border border-slate-250 dark:border-white/5 text-slate-500 dark:text-slate-500 select-none">
                {currentUser.email}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-355 font-semibold mb-1.5 flex items-center gap-1">
                <span>Account Clearance</span>
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-955/60 border border-slate-250 dark:border-white/5 text-slate-750 dark:text-indigo-400 font-mono font-bold capitalize select-none">
                {currentUser.role === 'admin' ? 'Organizer (Admin)' : 'Attendee (User)'}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 382-9102"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Avatar Image URL</label>
              <div className="relative">
                <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-955 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all hover:scale-102"
            >
              Save Profile Changes
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

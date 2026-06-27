import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login, signUp } = useApp();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      if (!name || !email || !password || !phone) {
        setErrorMessage('All registration fields are required.');
        return;
      }
      const res = signUp(name, email, password, phone, selectedRole);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to sign up.');
      }
    } else {
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to log in.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-950 dark:text-slate-100 bg-white">
        
        {/* Glow ambient background (hidden/subtle in light mode) */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSignUp ? 'Join the SaaS ticketing and registration system' : 'Sign in to access your registered tickets and events'}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 382-9102"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('user')}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedRole === 'user'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  👤 Attendee (User)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  🛡️ Organizer (Admin)
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSignUp ? 'Register & Enter' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            {isSignUp ? 'Sign In here' : 'Sign Up here'}
          </button>
        </div>

      </div>
    </div>
  );
};

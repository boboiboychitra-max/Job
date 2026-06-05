import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthProvider';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuth, 
    openAuth, 
    loginWithGoogle, 
    signUpWithEmail, 
    signInWithEmail 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'signup') {
        if (!displayName) {
          throw new Error('Please enter your full name');
        }
        await signUpWithEmail(email, password, displayName, role);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      // Map standard short error messages
      let msg = err.message || 'An authentication error occurred';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password, please try again.';
      if (err.code === 'auth/user-not-found') msg = 'No user account found with this email.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please sign in instead.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuth}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      {/* Modal sheet card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ tension: 240, friction: 25 }}
        className="relative w-full max-w-md bg-white dark:bg-neutral-850 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 text-neutral-800 dark:text-neutral-100 transition-colors duration-300"
      >
        
        {/* Close Button */}
        <button 
          onClick={closeAuth}
          className="absolute right-4 top-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="space-y-1 text-center mb-6">
          <div className="inline-flex w-10 h-10 rounded-xl bg-brand text-white items-center justify-center font-bold text-lg mb-1 shadow-sm shadow-brand/20">
            JP
          </div>
          <h3 className="text-xl font-bold font-sans tracking-tight">
            {authModalMode === 'signin' ? 'Sign in to JobPortal' : 'Create candidate profile'}
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            For Cambodia's rising ecosystem Builders
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/30 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authModalMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-neutral-400 dark:text-neutral-500 pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Sok Samnang"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-neutral-800 dark:text-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-neutral-400 dark:text-neutral-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="samnang@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-neutral-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-neutral-400 dark:text-neutral-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-neutral-800 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Account Role Selector if signing up */}
          {authModalMode === 'signup' && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">
                Your Primary Goal
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    role === 'candidate'
                      ? 'border-brand bg-brand/5 ring-1 ring-brand text-neutral-800 dark:text-white font-medium'
                      : 'border-slate-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold font-sans">Apply for Jobs</span>
                  <span className="text-[10px] opacity-70 leading-normal block mt-1.5 font-normal">Candidate seeking standard vacancies</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    role === 'employer'
                      ? 'border-brand bg-brand/5 ring-1 ring-brand text-neutral-800 dark:text-white font-medium'
                      : 'border-slate-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold font-sans">Post Job Gigs</span>
                  <span className="text-[10px] opacity-70 leading-normal block mt-1.5 font-normal">Employer/recruiter hiring talent</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-brand hover:brightness-110 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-brand/10 hover:shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <span>{authModalMode === 'signin' ? 'Sign In Securely' : 'Complete Sign Up'}</span>
            )}
          </button>
        </form>

        {/* Divider separator */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-150 dark:border-neutral-700/60" />
          </div>
          <span className="relative bg-white dark:bg-neutral-850 px-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            or continue with
          </span>
        </div>

        {/* Google Authentication Trigger Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-850/80 hover:scale-99 text-neutral-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700/60 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {/* Custom Google SVG logo icon */}
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Login via Google Account</span>
        </button>

        {/* Sign In vs Sign Up switch message */}
        <div className="pt-4 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {authModalMode === 'signin' ? (
              <>
                New to JobPortal?{' '}
                <button 
                  onClick={() => openAuth('signup')}
                  className="font-bold text-brand hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an profile?{' '}
                <button 
                  onClick={() => openAuth('signin')}
                  className="font-bold text-brand hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

      </motion.div>
    </div>
  );
}

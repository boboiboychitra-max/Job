import React, { useState } from 'react';
import { Search, Sun, Moon, Briefcase, Plus, User, FileText, Bookmark, LogOut, Check, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthProvider.tsx';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onPostJobClick: () => void;
  onSearchChange: (val: string) => void;
  searchQuery: string;
  savedJobsCount: number;
  onViewSavedJobs: () => void;
  showingSavedJobs: boolean;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  onPostJobClick,
  onSearchChange,
  searchQuery,
  savedJobsCount,
  onViewSavedJobs,
  showingSavedJobs
}: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, userProfile, openAuth, logout } = useAuth();

  const getInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'US';
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const isEmployer = userProfile?.role === 'employer';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-neutral-900/85 border-b border-slate-100 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Logo & Quick Platform Info */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => { onSearchChange(''); onViewSavedJobs(); }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center text-white font-bold shadow-sm">
            J
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
            JobPortal<span className="text-brand">.kh</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-light border border-brand/20">
            Premium
          </span>
        </div>

        {/* Center: Sticky Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/50 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-neutral-800 dark:text-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Side: Interaction Suite */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Saved Jobs Bookmark */}
          <button
            onClick={onViewSavedJobs}
            className={`relative p-2 rounded-full transition-colors duration-200 ${
              showingSavedJobs 
                ? 'bg-brand/10 text-brand dark:text-brand-light border border-brand/20' 
                : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800'
            }`}
            title="Saved Jobs"
          >
            <Bookmark className="w-4 h-4" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {savedJobsCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-slate-500 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Post Job Button */}
          <button
            onClick={onPostJobClick}
            className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 bg-brand hover:brightness-110 text-white font-semibold text-xs rounded-full shadow-md shadow-brand/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Post a Job
          </button>

          {/* User Profile Area (Authenticated vs Anonymous) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-0.5 rounded-full border border-slate-200/50 dark:border-neutral-700/45 hover:bg-slate-50 dark:hover:bg-neutral-850 transition-all cursor-pointer"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="avatar" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs select-none">
                    {getInitials()}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    {/* Backdrop closer */}
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 p-4 z-50 text-neutral-800 dark:text-neutral-200"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-750">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="avatar"
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-full object-cover shadow-inner"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-brand text-white text-base font-bold flex items-center justify-center shadow-inner">
                            {getInitials()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{displayName}</p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{displayEmail}</p>
                        </div>
                      </div>
                      
                      <div className="py-2.5 space-y-1">
                        <button 
                          onClick={() => { setProfileDropdownOpen(false); onViewSavedJobs(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700/60 transition-colors text-left"
                        >
                          <Bookmark className="w-4 h-4 text-neutral-400" />
                          My Bookmarks ({savedJobsCount})
                        </button>
                        <div className="px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/20 text-xs text-green-700 dark:text-green-400 border border-green-100/30 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{isEmployer ? 'Employer account' : 'Standard Candidate'}</span>
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 dark:border-neutral-750 pt-2.5">
                        <button 
                          onClick={() => { setProfileDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuth('signin')}
              className="flex items-center gap-1.5 px-4.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/60 text-neutral-800 dark:text-neutral-150 font-bold text-xs rounded-full border border-slate-200 dark:border-neutral-700 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 stroke-[2.2]" />
              <span>Sign In</span>
            </button>
          )}


        </div>
      </div>
      
      {/* Search Input for Mobile Viewports */}
      <div className="block md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-neutral-800 dark:text-white"
          />
        </div>
      </div>
    </header>
  );
}

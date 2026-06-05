import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Building2, TrendingUp, Users, ArrowUpRight, DollarSign, Award, Star } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

interface HeroProps {
  onPostJobClick: () => void;
  onSelectLocation: (loc: string) => void;
  onFocusSearch: () => void;
}

export default function Hero({ onPostJobClick, onSelectLocation, onFocusSearch }: HeroProps) {
  // Animated counters for trust indicators
  const [activeUsers, setActiveUsers] = useState(12800);
  const [totalJobs, setTotalJobs] = useState(482);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time signups slightly ticking up
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 md:pt-16 pb-12 lg:pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-neutral-905 dark:via-neutral-900 dark:to-neutral-900 transition-colors duration-300">
      
      {/* Decorative background grid elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-100 dark:text-neutral-800" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left half: Copy, value proposition, and trust parameters */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-750/50"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-semibold text-brand tracking-wide uppercase">
              The Kingdom's Premier Hub
            </span>
            <div className="text-[10px] bg-brand/10 dark:bg-brand/25 text-brand dark:text-brand-light px-1.5 py-0.5 rounded-full font-bold">
              34 New Today
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Find your next <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent italic font-serif">
              dream career
            </span>
            .
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            Discover over <span className="font-bold text-brand dark:text-brand-light">{totalJobs}</span> verified full-time, contract, and elite remote roles in Phnom Penh, Siem Reap, and beyond. Step into Cambodia's next-generation tech and business paradigm.
          </motion.p>

          {/* Interactive CTA buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={onFocusSearch}
              className="px-8 py-3.5 rounded-full bg-brand hover:brightness-110 text-white font-bold text-xs shadow-md shadow-brand/20 transition-all duration-200 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              Explore Job Board
            </button>
            <button 
              onClick={onPostJobClick}
              className="px-8 py-3.5 rounded-full border border-slate-200 dark:border-neutral-700/80 hover:border-brand dark:hover:border-brand hover:text-brand text-neutral-700 dark:text-neutral-300 font-bold text-xs bg-white dark:bg-neutral-800/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Post a Premium Vacancy
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6 sm:pt-8 border-t border-neutral-100 dark:border-neutral-805 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
          >
            <div className="flex -space-x-3.5">
              <img className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Job Seeker" />
              <img className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Job Seeker" />
              <img className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Job Seeker" />
              <img className="w-11 h-11 rounded-full border-2 border-white dark:border-neutral-900 object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Job Seeker" />
              <div className="w-11 h-11 rounded-full bg-brand border-2 border-white dark:border-neutral-900 flex items-center justify-center text-white text-xs font-bold leading-none">
                +4k
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-brand dark:text-brand-light font-bold text-lg">
                <Users className="w-4 h-4" />
                <span>{activeUsers.toLocaleString()}</span>
              </div>
              <p className="text-xs text-neutral-510 dark:text-neutral-400 font-medium">
                Active candidates land roles monthly
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right half: Glassmorphic interactive dashboard layout */}
        <div className="lg:col-span-5 relative">
          
          {/* Subtle backlighting effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-500/20 to-indigo-600/15 blur-2xl z-0 pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            
            {/* 1. AVERAGE SALARY CARD */}
            <div className="group rounded-3xl p-5 bg-white/70 dark:bg-neutral-850/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/40 shadow-sm hover:shadow-md hover:border-brand/35 dark:hover:border-neutral-600/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-2xl bg-brand/10 dark:bg-neutral-800 text-brand dark:text-brand-light">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-100/20 text-xs font-semibold text-green-700 dark:text-green-400">
                  +12.4%
                </div>
              </div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium tracking-wide uppercase">
                Average salary
              </span>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                $2,450 <span className="text-xs text-neutral-400 font-normal">/ mo</span>
              </h3>
              
              {/* Decorative mini high-end inline SVG line chart showing growth */}
              <div className="h-10 mt-3 flex items-end">
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path 
                    d="M 0 25 C 20 20, 30 15, 55 10 C 75 5, 85 2, 100 1" 
                    fill="none" 
                    stroke="url(#chartGradient)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4F6BFF" />
                      <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 2. TOP COMPANIES CARD */}
            <div className="rounded-3xl p-5 bg-white/70 dark:bg-neutral-850/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/40 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-neutral-600/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium tracking-wide uppercase">
                    Partner Companies
                  </span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo letter="G" className="w-7 h-7 text-[10px]" />
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Glide Tech</span>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-neutral-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                      4.9
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo letter="S" className="w-7 h-7 text-[10px]" />
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Sabaicode</span>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-neutral-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                      4.8
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-brand dark:text-brand-light font-bold mt-2.5 hover:underline cursor-pointer flex items-center justify-between">
                Explore 120+ enterprises
                <span>&rarr;</span>
              </div>
            </div>

            {/* 3. AVAILABLE LOCATIONS CARD */}
            <div className="rounded-3xl p-5 bg-white/70 dark:bg-neutral-850/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/40 shadow-sm hover:shadow-md hover:border-brand/35 dark:hover:border-neutral-600/50 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3.5">
                <MapPin className="w-4 h-4 text-brand dark:text-brand-light" />
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium tracking-wide uppercase">
                  Regions hiring
                </span>
              </div>

              <div className="space-y-2.5">
                <div 
                  onClick={() => onSelectLocation('Phnom Penh, KH')}
                  className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Phnom Penh</span>
                  <span className="text-[10px] bg-brand/10 text-brand dark:text-brand-light px-2 py-0.5 rounded-md font-bold">142 jobs</span>
                </div>
                <div 
                  onClick={() => onSelectLocation('Siem Reap, KH')}
                  className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Siem Reap</span>
                  <span className="text-[10px] bg-neutral-100 dark:bg-neutral-855 text-neutral-650 dark:text-neutral-400 px-2 py-0.5 rounded-md font-bold">54 jobs</span>
                </div>
                <div 
                  onClick={() => onSelectLocation('Remote (Worldwide)')}
                  className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Remote</span>
                  <span className="text-[10px] bg-brand/10 text-brand dark:text-brand-light px-2 py-0.5 rounded-md font-bold">88 jobs</span>
                </div>
              </div>
            </div>

            {/* 4. EMPLOYER CTA CARD */}
            <div className="rounded-3xl p-5 bg-gradient-to-tr from-brand to-accent border border-brand/20 text-white shadow-lg shadow-brand/20 flex flex-col justify-between hover:scale-[1.02] duration-300 transition-all">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light">
                  Ready to grow?
                </span>
                <h4 className="font-bold text-base leading-tight mt-1.5">
                  Are you hiring premium builders?
                </h4>
                <p className="text-xs text-white/90 font-normal mt-1">
                  Get absolute matching resumes or direct interviews instantly.
                </p>
              </div>

              <button 
                onClick={onPostJobClick}
                className="mt-4 px-4 py-2 bg-white text-brand hover:bg-slate-50 font-bold text-xs rounded-xl self-start transition-all"
              >
                Publish Slot
              </button>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}

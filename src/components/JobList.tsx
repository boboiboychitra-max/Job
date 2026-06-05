import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, DollarSign, Calendar, Briefcase, Star, Bookmark, BookmarkCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { Job } from '../types';
import CompanyLogo from './CompanyLogo';

interface JobListProps {
  jobs: Job[];
  savedJobs: string[];
  onToggleSaveJob: (id: string) => void;
  onSelectJob: (job: Job) => void;
  isLoading: boolean;
  filterSummary: string;
  onResetFilters: () => void;
}

export default function JobList({
  jobs,
  savedJobs,
  onToggleSaveJob,
  onSelectJob,
  isLoading,
  filterSummary,
  onResetFilters
}: JobListProps) {
  
  // Custom container orchestration animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  // Render 4 high-end loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div 
            key={n}
            className="p-6 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-800 shadow-sm animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-3/5">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-2xl shrink-0" />
              <div className="space-y-2.5 w-full">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-md w-3/4" />
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-1/2" />
              </div>
            </div>
            <div className="flex md:flex-col items-start gap-2 w-full md:w-1/5 pt-2 md:pt-0">
              <div className="h-3 bg-neutral-150 dark:bg-neutral-800 rounded-md w-2/3" />
              <div className="h-3 bg-neutral-150 dark:bg-neutral-800 rounded-md w-1/3" />
            </div>
            <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-24 shrink-0 mt-2 md:mt-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search outcome caption */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white">
            {jobs.length === 0 ? 'No open vacancies' : `Open Vacancies in Cambodia (${jobs.length})`}
          </h3>
          {filterSummary && (
            <p className="text-xs text-neutral-410 dark:text-neutral-400 mt-0.5">
              Current Filters: <span className="text-brand dark:text-brand-light font-semibold" dangerouslySetInnerHTML={{ __html: filterSummary }} />
            </p>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
          <Calendar className="w-3.5 h-3.5" />
          Updated: June 2026
        </div>
      </div>

      {jobs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6 bg-neutral-50 dark:bg-neutral-850/40 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-750"
        >
          <div className="w-12 h-12 bg-brand/10 dark:bg-neutral-800 text-brand dark:text-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-neutral-800 dark:text-white">No jobs matched your filter query</h4>
          <p className="text-xs text-neutral-410 dark:text-neutral-405 mt-1.5 max-w-sm mx-auto">
            Try adjusting your search query, selecting a wider location area, or clearing filters to view all listings.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 px-6 py-2.5 bg-brand hover:brightness-110 text-white text-xs font-bold rounded-full shadow-md shadow-brand/10 transition-all"
          >
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {jobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);
            
            return (
              <motion.div
                key={job.id}
                variants={itemVariants}
                layoutId={`job-card-layout-${job.id}`}
                className={`group relative p-5 sm:p-6 bg-white dark:bg-neutral-855 rounded-3xl border ${
                  job.featured 
                    ? 'border-brand/30 dark:border-brand/20 bg-brand/5' 
                    : 'border-slate-250/60 dark:border-neutral-800'
                } shadow-sm hover:shadow-md hover:border-brand/40 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5`}
              >
                
                {/* Featured glowing banner left tag */}
                {job.featured && (
                  <div className="absolute top-0 left-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-brand/10">
                    Featured
                  </div>
                )}

                {/* Left Block: Company Details & Job Metadata */}
                <div className="flex items-start gap-4">
                  <CompanyLogo letter={job.companyLogo} className="w-12 h-12 text-base shadow-sm shrink-0" />
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-brand dark:text-brand-light bg-brand/10 px-2 py-0.5 rounded-full">
                      {job.industry}
                    </span>
                    <h4 
                      onClick={() => onSelectJob(job)}
                      className="text-base font-bold text-neutral-900 dark:text-white hover:text-brand dark:hover:text-brand-light cursor-pointer transition-colors pt-1"
                    >
                      {job.title}
                    </h4>
                    <p className="text-xs text-neutral-510 dark:text-neutral-400 font-medium">
                      {job.companyName} &bull; <span className="italic">{job.location}</span>
                    </p>
                  </div>
                </div>

                {/* Center Block: Salary & Specific Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100/30">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-350 border border-slate-100/30 dark:border-neutral-700">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    {job.type}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-350 border border-slate-100/30 dark:border-neutral-700">
                    {job.experience} exp
                  </span>
                </div>

                {/* Right Block: Action Suites */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800.">
                  <span className="text-[10px] text-neutral-410 dark:text-neutral-405 font-medium md:mr-1">
                    {job.postedAt}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleSaveJob(job.id)}
                      className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-brand/10 dark:bg-neutral-800 border-brand/20 text-brand dark:text-brand-light' 
                          : 'bg-white dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-750 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Expand/Apply Details */}
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-brand dark:hover:bg-brand-light hover:text-white dark:hover:text-neutral-900 font-bold text-xs rounded-full shadow-md shadow-neutral-900/10 dark:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      )}

    </div>
  );
}

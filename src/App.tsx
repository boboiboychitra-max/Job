import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobSearch from './components/JobSearch';
import JobList from './components/JobList';
import JobDetailsModal from './components/JobDetailsModal';
import PostJobModal from './components/PostJobModal';
import { Job } from './types';
import { INITIAL_JOBS } from './data/mockData';
import { Briefcase, ArrowUpRight, ShieldCheck, Mail, Globe, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from './components/AuthProvider.tsx';
import AuthModal from './components/AuthModal.tsx';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';

export default function App() {
  const { user, openAuth } = useAuth();

  const handlePostJobClick = () => {
    if (!user) {
      openAuth('signin');
    } else {
      setIsPostingJobOpen(true);
    }
  };

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('portal_dark_mode');
    return saved === 'true';
  });

  // Jobs persistence states
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('portal_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  // Query jobs collection on load or whenever user session state changes
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobs');
        const snap = await getDocs(jobsCollection);
        const fetchedList: Job[] = [];
        snap.forEach((docSnap) => {
          fetchedList.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Job);
        });

        if (fetchedList.length > 0) {
          // Sort or prepend newly posted items first
          setJobs(fetchedList);
        } else {
          setJobs(INITIAL_JOBS);
        }
      } catch (err) {
        console.warn("Firestore collection query warning (falling back to initial mock list):", err);
        setJobs((prev) => prev.length > 0 ? prev : INITIAL_JOBS);
      }
    };
    fetchJobs();
  }, [user]);

  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('portal_saved');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('portal_applied');
    return saved ? JSON.parse(saved) : [];
  });

  // Search and filter parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Custom bookmark filter state
  const [showingSavedJobs, setShowingSavedJobs] = useState(false);

  // Modal visual states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isPostingJobOpen, setIsPostingJobOpen] = useState(false);

  // Tactile loading skeleton triggers
  const [isLoading, setIsLoading] = useState(false);

  // Sync dark mode style on document.documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portal_dark_mode', String(darkMode));
  }, [darkMode]);

  // Sync state mutations to local storage
  useEffect(() => {
    localStorage.setItem('portal_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('portal_saved', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('portal_applied', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // Simulate premium loading skeleton feedback whenever any filter shifts
  useEffect(() => {
    setIsLoading(true);
    const scrollTimer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(scrollTimer);
  }, [searchQuery, selectedLocation, selectedCategory, selectedType, showingSavedJobs]);

  // Filter computation logic
  const filteredJobs = jobs.filter((job) => {
    // 1. Saved Jobs filtering
    if (showingSavedJobs && !savedJobs.includes(job.id)) {
      return false;
    }

    // 2. Search box matching
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.companyName.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchIndustry = job.industry.toLowerCase().includes(q);
      const matchLocation = job.location.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchDesc && !matchIndustry && !matchLocation) {
        return false;
      }
    }

    // 3. Location dropdown matching
    if (selectedLocation !== 'All Locations') {
      const loc = selectedLocation.toLowerCase();
      const jobLoc = job.location.toLowerCase();
      // Handle approximate remote tags
      if (loc.includes('remote') && !jobLoc.includes('remote')) {
        return false;
      }
      if (!loc.includes('remote') && !jobLoc.includes(loc.split(',')[0])) {
        return false;
      }
    }

    // 4. Category (Career Path) match
    if (selectedCategory && job.industry.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // 5. Employment Type match
    if (selectedType && job.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Compose active filters label for display helper
  const getFilterSummary = () => {
    const list: string[] = [];
    if (showingSavedJobs) list.push('Bookmarked positions');
    if (selectedLocation !== 'All Locations') list.push(selectedLocation);
    if (selectedCategory) list.push(selectedCategory);
    if (selectedType) list.push(selectedType);
    if (searchQuery) list.push(`"${searchQuery}"`);
    return list.join(' &bull; ');
  };

  const handleToggleSaveJob = (id: string) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplySuccess = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs((prev) => [...prev, jobId]);
    }
  };

  const handleAddCustomJob = async (newJob: Job) => {
    if (user) {
      try {
        const docId = newJob.id;
        const targetDocRef = doc(db, 'jobs', docId);
        
        // Match structural boundaries of our schema and rules exactly:
        const payload = {
          title: newJob.title,
          companyName: newJob.companyName,
          industry: newJob.industry,
          location: newJob.location,
          type: newJob.type,
          salary: newJob.salary,
          experience: newJob.experience,
          description: newJob.description,
          postedAt: newJob.postedAt,
          creatorId: user.uid,
          featured: true,
          requirements: newJob.requirements || [],
          benefits: newJob.benefits || [],
        };
        await setDoc(targetDocRef, payload);
        setJobs((prev) => [newJob, ...prev]);
        console.log("Vacancy synced to cloud database successfully: ", docId);
      } catch (err) {
        console.error("Relational write failed: falling back to local list:", err);
        setJobs((prev) => [newJob, ...prev]);
        handleFirestoreError(err, OperationType.CREATE, `jobs/${newJob.id}`);
      }
    } else {
      setJobs((prev) => [newJob, ...prev]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Locations');
    setSelectedCategory('');
    setSelectedType('');
    setShowingSavedJobs(false);
  };

  const focusSearchInput = () => {
    const el = document.getElementById('main-job-search-input');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 font-sans transition-colors duration-300">
      
      {/* Sticky Glassmorphism Header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onPostJobClick={handlePostJobClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedJobsCount={savedJobs.length}
        onViewSavedJobs={() => setShowingSavedJobs(!showingSavedJobs)}
        showingSavedJobs={showingSavedJobs}
      />

      {/* Brand Hero parameters */}
      <Hero
        onPostJobClick={handlePostJobClick}
        onSelectLocation={(loc) => { setSelectedLocation(loc); focusSearchInput(); }}
        onFocusSearch={focusSearchInput}
      />

      {/* Advanced filters component */}
      <JobSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onClearFilters={handleResetFilters}
      />

      {/* Main Core Layout: Split dynamic listings alongside resume upload guide */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Listings Block */}
          <div className="lg:col-span-8 space-y-6">
            <JobList
              jobs={filteredJobs}
              savedJobs={savedJobs}
              onToggleSaveJob={handleToggleSaveJob}
              onSelectJob={setSelectedJob}
              isLoading={isLoading}
              filterSummary={getFilterSummary()}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Grid: Supportive Platform widgets & Resume optimization cards */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Widget 1: Career metrics & Verification Badge */}
            <div className="p-6 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-150 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-10/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-neutral-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-white">Cambodian Trust Guarantee</h4>
              </div>
              <p className="text-xs text-neutral-510 dark:text-neutral-400 leading-relaxed font-normal">
                Every employer profile and vacancy slot is manually vetted by our operating team to prevent fraudulent postings and guarantee actual USD-indexed compensation scales.
              </p>
              
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-730 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified physical corporate offices</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-730 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Responsive recruiter reply average (48h)</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Resume builder CTA / Tips */}
            <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-850 text-white rounded-3xl border border-neutral-800 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
                <Globe className="w-48 h-48" />
              </div>

              <span className="text-[9px] font-bold text-blue-400 tracking-wider uppercase block">
                Resource Center
              </span>
              <h4 className="font-bold text-sm text-white">
                Optimize your pitch for Cambodian Tech Teams
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Startups in Phnom Penh look for swift communication, proficiency in modern React/Vite/TS libraries, and progressive system ownership.
              </p>
              
              <ul className="text-[11px] text-neutral-400 space-y-1.5 list-disc pl-4 font-normal">
                <li>State USD expectation clearly on request</li>
                <li>Format resume files in pure PDF before uploading</li>
                <li>Highlight system building and product thinking</li>
              </ul>
            </div>

            {/* Info Footer copyright */}
            <div className="pt-2 text-center lg:text-left space-y-2">
              <div className="text-[11px] text-neutral-400 flex items-center justify-center lg:justify-start gap-1">
                <span>Built for Cambodia’s upcoming dream builders with</span>
                <Heart className="w-3 H-3 text-red-500 fill-red-500 inline mx-0.5" />
              </div>
              <p className="text-[10px] text-neutral-500">
                &copy; 2450 JobPortal &bull; Phnom Penh Co-Working Space. All Rights Reserved.
              </p>
            </div>

          </aside>
        </div>
      </main>

      {/* Expanded Position detail modal pop-up */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplySuccess={handleApplySuccess}
          hasApplied={appliedJobs.includes(selectedJob.id)}
        />
      )}

      {/* Employer post modal slot */}
      <PostJobModal
        isOpen={isPostingJobOpen}
        onClose={() => setIsPostingJobOpen(false)}
        onAddJob={handleAddCustomJob}
      />

      {/* Global Client Authentication Layer */}
      <AuthModal />

    </div>
  );
}

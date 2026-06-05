import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Sparkles, Building2, MapPin, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';
import { LOCATIONS } from '../data/mockData';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export default function PostJobModal({ isOpen, onClose, onAddJob }: PostJobModalProps) {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Software Engineering');
  const [location, setLocation] = useState('Phnom Penh, KH');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship'>('Full-time');
  const [salary, setSalary] = useState('$1,500 - $3,000');
  const [experience, setExperience] = useState('2+ Years');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !description) {
      alert('Please fill out Title, Company Name, and Description.');
      return;
    }

    // Process requirements and benefits split by comma or newline
    const requirements = requirementsInput
      ? requirementsInput.split(/[,\n]/).map(r => r.trim()).filter(r => r.length > 0)
      : ['Strong knowledge of the domain', 'Excellent team work and communicative fluency'];

    const benefits = benefitsInput
      ? benefitsInput.split(/[,\n]/).map(b => b.trim()).filter(b => b.length > 0)
      : ['Flexible working hours and remote options', 'USD indexed competitive compensation model'];

    const newJob: Job = {
      id: `custom-job-${Date.now()}`,
      title,
      companyName,
      companyLogo: companyName.charAt(0).toUpperCase(),
      industry,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      benefits,
      postedAt: 'Just now',
      featured: true // New positions are marked featured for priority visibility
    };

    onAddJob(newJob);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetLocalForm();
      onClose();
    }, 2000);
  };

  const resetLocalForm = () => {
    setTitle('');
    setCompanyName('');
    setIndustry('Software Engineering');
    setLocation('Phnom Penh, KH');
    setType('Full-time');
    setSalary('$1,500 - $3,000');
    setExperience('2+ Years');
    setDescription('');
    setRequirementsInput('');
    setBenefitsInput('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[28px] shadow-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 z-50 text-neutral-800 dark:text-neutral-255"
          >
            {/* Header strip */}
            <div className="h-4 bg-gradient-to-r from-brand to-accent" />

            <button 
              onClick={onClose}
              className="absolute top-8 right-6 p-2 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-250 dark:hover:bg-neutral-750 text-neutral-500 dark:text-neutral-305 transition-all text-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <span className="inline-flex items-center gap-1.5 text-xs text-brand dark:text-brand-light font-bold uppercase tracking-wider bg-brand/10 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand dark:text-brand-light" />
                  Market Launch Promo
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white mt-1.5">
                  Publish a Vacancy slot
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Instantly publish your developer, designer, or creator positions to Cambodia’s tech talents.
                </p>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center space-y-3"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">Active and Published!</h4>
                  <p className="text-xs text-neutral-410">
                    Your job was successfully integrated. Candidates can now view details and submit applications instantly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead UI Designer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-11 px-4.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sabaicode"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full h-11 px-4.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Career Path / Category *</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full h-11 px-4 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm cursor-pointer"
                      >
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Product & Brand Design">Product & Brand Design</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Growth & Marketing">Growth & Marketing</option>
                        <option value="Finance & Operations">Finance & Operations</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Workforce Location *</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full h-11 px-4 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm cursor-pointer"
                      >
                        <option value="Phnom Penh, KH">Phnom Penh, KH</option>
                        <option value="Siem Reap, KH">Siem Reap, KH</option>
                        <option value="Sihanoukville, KH">Sihanoukville, KH</option>
                        <option value="Remote (Worldwide)">Remote (Worldwide)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Position Type *</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full h-11 px-4 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm cursor-pointer"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote Only</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Salary Range *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. $2,000 - $3,500"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full h-11 px-4.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Experience required *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 3+ Years"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full h-11 px-4.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Role Summary / Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="High-level description of what this role entails..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-neutral-800 dark:text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">
                        Candidates Requirements (separated by commas)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="React Native experience, Figma libraries expertise, CI/CD knowledge"
                        value={requirementsInput}
                        onChange={(e) => setRequirementsInput(e.target.value)}
                        className="w-full px-4.5 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-2xl text-xs focus:ring-2 focus:ring-brand/20 focus:border-brand focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">
                        Perks & Benefits (separated by commas)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Relocation budget, Catered meals, $1,500 annual workspace allowance"
                        value={benefitsInput}
                        onChange={(e) => setBenefitsInput(e.target.value)}
                        className="w-full px-4.5 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-2xl text-xs focus:ring-2 focus:ring-brand/20 focus:border-brand focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 border border-slate-200 dark:border-neutral-800 text-xs font-bold rounded-full hover:bg-neutral-50 text-neutral-700 dark:text-neutral-200"
                    >
                      Hold post
                    </button>
                    
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md shadow-brand/10 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Publish Position
                    </button>
                  </div>
                </form>
              )}

            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

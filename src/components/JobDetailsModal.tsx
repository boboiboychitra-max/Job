import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, DollarSign, Briefcase, Calendar, Upload, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';
import { Job } from '../types';
import CompanyLogo from './CompanyLogo';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApplySuccess: (jobId: string) => void;
  hasApplied: boolean;
}

export default function JobDetailsModal({
  job,
  onClose,
  onApplySuccess,
  hasApplied
}: JobDetailsModalProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!job) return null;

  // File drag & drop triggers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in required fields (Name and Email).');
      return;
    }

    setIsSubmitting(true);
    let fileDataUrl = '';
    let fileName = '';

    try {
      if (file) {
        fileName = file.name;
        fileDataUrl = await convertBase64(file);
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          coverLetter,
          jobTitle: job.title,
          companyName: job.companyName,
          fileName,
          fileDataUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitDone(true);
      onApplySuccess(job.id);
    } catch (err: any) {
      console.error('Job submission error:', err);
      alert(`An error occurred while transmitting your application: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetLocalForm = () => {
    setShowApplyForm(false);
    setName('');
    setEmail('');
    setCoverLetter('');
    setFile(null);
    setSubmitDone(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        
        {/* Darkened overlay backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Outer Shell Wrapper */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-[28px] shadow-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 z-50 text-neutral-800 dark:text-neutral-200"
          >
            
            {/* Header / Brand Banner colored strip */}
            <div className="h-4 bg-gradient-to-r from-brand to-accent" />

            {/* Close Button Trigger */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-6 p-2 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-510 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              
              {/* Job Logo & Header Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <CompanyLogo letter={job.companyLogo} className="w-14 h-14 text-lg shadow-sm" />
                
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-brand dark:text-brand-light px-2.5 py-0.5 rounded-full bg-brand/10">
                      {job.industry}
                    </span>
                    {job.featured && (
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-200/20">
                        Vetted Lead
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                    {job.title}
                  </h3>
                  <p className="text-sm font-semibold text-neutral-510 dark:text-neutral-410">
                    {job.companyName} &bull; <span className="italic font-normal">{job.location}</span>
                  </p>
                </div>
              </div>

              {/* Main Modal Layout Bifurcation */}
              {!showApplyForm ? (
                <>
                  {/* Detailed Description Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column: Descriptions */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-extrabold text-neutral-410 dark:text-neutral-500 tracking-wider uppercase">
                          Role Overview
                        </h4>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                          {job.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-neutral-410 dark:text-neutral-500 tracking-wider uppercase">
                          Technical Requirements
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-350">
                              <span className="text-brand dark:text-brand-light mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand" />
                              <span className="font-normal">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-neutral-410 dark:text-neutral-500 tracking-wider uppercase">
                          Benefits & Perks
                        </h4>
                        <ul className="space-y-2">
                          {job.benefits.map((ben, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-350">
                              <span className="text-emerald-555 dark:text-emerald-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="font-normal">{ben}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Meta Info Card & Action Panel */}
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-150 dark:border-neutral-800 space-y-4">
                        <h5 className="font-bold text-sm text-neutral-800 dark:text-white">Job parameters</h5>
                        
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                            <span className="text-neutral-400">Offered Salary</span>
                            <span className="font-bold text-green-720 dark:text-green-400">{job.salary}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                            <span className="text-neutral-400">Employment Type</span>
                            <span className="font-bold">{job.type}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                            <span className="text-neutral-400">Experience required</span>
                            <span className="font-bold">{job.experience}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-neutral-400">Time Posted</span>
                            <span className="font-medium text-neutral-500">{job.postedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Modal Main CTA Trigger */}
                      {hasApplied ? (
                        <div className="w-full py-3.5 bg-green-550/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-full text-center text-xs font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          Applied successfully
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowApplyForm(true)}
                          className="w-full py-3.5 bg-brand hover:brightness-110 text-white font-bold text-xs rounded-full shadow-md shadow-brand/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Quick Apply with Resume
                        </button>
                      )}

                      <button
                        onClick={onClose}
                        className="w-full py-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-350 font-bold text-xs rounded-full transition-all"
                      >
                        Browse other positions
                      </button>
                    </div>

                  </div>
                </>
              ) : (
                /* Interactive Dual Drag-Drop PDF Resume Apply Form */
                <form onSubmit={handleApplySubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-white">Apply to {job.companyName}</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowApplyForm(false)}
                      className="text-xs text-brand hover:underline font-semibold"
                    >
                      &larr; Back to Details
                    </button>
                  </div>

                  {submitDone ? (
                    <div className="py-12 text-center text-neutral-800 dark:text-white space-y-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-950/25 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h4 className="text-xl font-bold">Application Sent!</h4>
                      <p className="text-sm text-neutral-410 max-w-sm mx-auto">
                        Your resume and profile have been securely published to <strong>{job.companyName}</strong>. They will reach you shortly at <strong>{email}</strong>.
                      </p>
                      
                      <button
                        type="button"
                        onClick={resetLocalForm}
                        className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 font-bold text-xs rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="johndoe@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Cover Pitch Letter (Optional)</label>
                        <textarea
                          rows={3}
                          placeholder="Why are you a fantastic fit for this position in Cambodia?"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm resize-none"
                        />
                      </div>

                      {/* PDF Resume Uploader supporting Drag & Drop */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-510 dark:text-neutral-400">Upload Professional Resume (PDF) *</label>
                        
                        <div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            dragActive 
                              ? 'border-brand bg-brand/5' 
                              : file 
                                ? 'border-green-400 bg-green-50/10 dark:bg-neutral-855/20' 
                                : 'border-slate-200 dark:border-neutral-800 hover:border-brand dark:hover:hover:border-neutral-700'
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />

                          {file ? (
                            <div className="text-center space-y-2">
                              <FileText className="w-8 h-8 text-green-500 mx-auto" />
                              <p className="text-sm font-bold text-neutral-800 dark:text-white">{file.name}</p>
                              <p className="text-xs text-neutral-400">{(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready to submit</p>
                              <span className="text-xs text-brand dark:text-brand-light underline mt-1 block">Change file</span>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mx-auto" />
                              <p className="text-sm font-bold">Drag and drop your PDF resume here</p>
                              <p className="text-xs text-neutral-410 leading-normal">
                                Support PDF, DOCX formats. Max 5MB. <br />
                                Or <span className="text-brand dark:text-brand-light font-semibold underline">click to search directory</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowApplyForm(false)}
                          className="px-5 py-2.5 border border-slate-200 dark:border-neutral-800 text-xs font-bold rounded-full hover:bg-neutral-50 text-neutral-700 dark:text-neutral-200"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-brand hover:brightness-110 text-white text-xs font-bold rounded-full flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-brand/10"
                        >
                          {isSubmitting ? 'Transmitting candidate...' : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Submit Application
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                </form>
              )}

            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
}

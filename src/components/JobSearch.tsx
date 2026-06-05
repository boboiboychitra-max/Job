import React from 'react';
import { Search, MapPin, Laptop, Palette, Compass, Megaphone, Briefcase, Filter, RefreshCcw } from 'lucide-react';
import { POPULAR_CATEGORIES, LOCATIONS } from '../data/mockData';

// Map icon names from static string declaration to Lucide Icons
const iconMap: { [key: string]: any } = {
  Laptop,
  Palette,
  Compass,
  Megaphone,
  Briefcase
};

interface JobSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  onClearFilters: () => void;
}

export default function JobSearch({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  onClearFilters
}: JobSearchProps) {
  
  const handleCategoryToggle = (catName: string) => {
    if (selectedCategory === catName) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(catName);
    }
  };

  const handleTypeToggle = (type: string) => {
    if (selectedType === type) {
      setSelectedType('');
    } else {
      setSelectedType(type);
    }
  };

  const hasActiveFilters = searchQuery || selectedLocation !== 'All Locations' || selectedCategory || selectedType;

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Row 1: Direct Filter Control Center */}
        <div className="w-full bg-neutral-50 dark:bg-neutral-850 p-4 sm:p-5 rounded-3xl border border-neutral-200/40 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
          
          <div className="w-full md:w-5/12 relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-400 dark:text-neutral-500">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              id="main-job-search-input"
              type="text"
              placeholder="Filter by keywords, skills, titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-750 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-neutral-800 dark:text-white transition-all shadow-sm"
            />
          </div>

          <div className="w-full md:w-4/12 relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-neutral-400 dark:text-neutral-500">
              <MapPin className="w-4.5 h-4.5" />
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-11 pl-11 pr-8 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-750 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-neutral-750 dark:text-neutral-300 transition-all cursor-pointer appearance-none shadow-sm"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All Locations' ? 'All locations (World)' : loc}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-3/12 flex items-center gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-11 pl-4 pr-8 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-750 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-neutral-750 dark:text-neutral-300 transition-all cursor-pointer appearance-none shadow-sm"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote Only</option>
              <option value="Internship">Internship</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="h-11 w-11 flex items-center justify-center bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand dark:text-brand-light rounded-full cursor-pointer transition-colors shrink-0"
                title="Reset filters"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Row 2: Category capsules select chips */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-410 dark:text-neutral-400 tracking-wider uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Top Career Paths In Cambodia
          </h4>
          
          <div className="flex flex-wrap gap-2.5">
            {POPULAR_CATEGORIES.map((cat) => {
              const IconComp = iconMap[cat.icon] || Briefcase;
              const isSelected = selectedCategory === cat.name;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.name)}
                  className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-full border transition-all duration-200 text-xs cursor-pointer select-none font-semibold ${
                    isSelected
                      ? 'bg-brand border-brand text-white shadow-md shadow-brand/10'
                      : 'bg-white dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 border-slate-200/80 dark:border-neutral-755 text-neutral-700 dark:text-neutral-300 hover:border-brand/40'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand dark:text-brand-light'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] ml-1 px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

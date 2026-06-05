import React from 'react';

interface CompanyLogoProps {
  letter: string;
  className?: string;
}

export default function CompanyLogo({ letter, className = "w-11 h-11 text-sm" }: CompanyLogoProps) {
  // Generate a distinct designer gradient background based on the brand letter
  const getBrandStyle = (char: string) => {
    switch (char.toUpperCase()) {
      case 'G': // Glide Tech
        return 'from-cyan-400 to-blue-600 text-white shadow-cyan-100 dark:shadow-none';
      case 'S': // Sabaicode
        return 'from-indigo-500 to-purple-600 text-white shadow-indigo-100 dark:shadow-none';
      case 'A': // Angkor Creative
        return 'from-teal-400 to-emerald-500 text-white shadow-emerald-100 dark:shadow-none';
      case 'M': // Mango Byte
        return 'from-amber-400 to-orange-500 text-white shadow-orange-100 dark:shadow-none';
      case 'K': // Kiri Tech
        return 'from-rose-400 to-red-500 text-white shadow-rose-100 dark:shadow-none';
      default:
        return 'from-slate-400 to-slate-600 text-white shadow-slate-100 dark:shadow-none';
    }
  };

  return (
    <div
      className={`flex items-center justify-center font-bold rounded-xl bg-gradient-to-tr shadow-md select-none shrink-0 ${getBrandStyle(
        letter
      )} ${className}`}
    >
      {letter}
    </div>
  );
}

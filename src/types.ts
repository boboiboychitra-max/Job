export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  rating: number;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  industry: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  featured?: boolean;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export interface SearchFilters {
  query: string;
  location: string;
  category: string;
  type: string;
}

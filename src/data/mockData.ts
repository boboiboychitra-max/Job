import { Job, Company } from '../types';

export const POPULAR_CATEGORIES = [
  { id: 'tech', name: 'Software Engineering', count: 142, icon: 'Laptop' },
  { id: 'design', name: 'Product & Brand Design', count: 98, icon: 'Palette' },
  { id: 'product', name: 'Product Management', count: 64, icon: 'Compass' },
  { id: 'marketing', name: 'Growth & Marketing', count: 110, icon: 'Megaphone' },
  { id: 'ops', name: 'Finance & Operations', count: 75, icon: 'Briefcase' },
];

export const TOP_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Sabaicode',
    industry: 'EdTech & Coding',
    location: 'Phnom Penh',
    logo: 'S',
    rating: 4.8
  },
  {
    id: 'c2',
    name: 'Glide Tech',
    industry: 'FinTech Platforms',
    location: 'Phnom Penh / Remote',
    logo: 'G',
    rating: 4.9
  },
  {
    id: 'c3',
    name: 'Angkor Creative',
    industry: 'Design & Marketing',
    location: 'Siem Reap',
    logo: 'A',
    rating: 4.7
  },
  {
    id: 'c4',
    name: 'Mango Byte',
    industry: 'SaaS Solutions',
    location: 'Remote',
    logo: 'M',
    rating: 4.6
  }
];

export const LOCATIONS = [
  'All Locations',
  'Phnom Penh, KH',
  'Siem Reap, KH',
  'Sihanoukville, KH',
  'Remote (Worldwide)',
  'Singapore, SG',
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React/Vite)',
    companyName: 'Glide Tech',
    companyLogo: 'G',
    industry: 'FinTech Platforms',
    location: 'Phnom Penh, KH',
    type: 'Full-time',
    salary: '$3,200 - $4,800',
    experience: '4+ Years',
    description: 'We are seeking an experienced Frontend Developer who is passionate about creating high-performance, pixel-perfect user experiences for our next-generation digital banking suite serving Southeast Asia.',
    requirements: [
      'Strong expertise in React, TypeScript, and modern bundlers like Vite.',
      'In-depth knowledge of Tailwind CSS, transitions, and component state optimization.',
      'Experience building responsive web apps with complex interactive charts & data visualizers.',
      'Understanding of progressive web application architectures and SEO principles.'
    ],
    benefits: [
      'Competitive salary in USD with performance bonus matching.',
      'Comprehensive private health insurance (including dental).',
      'Flexible remote policy (hybrid) + modern co-working space access.',
      'Annual learning budget of $1,000 for courses and conferences.'
    ],
    postedAt: '2 hours ago',
    featured: true
  },
  {
    id: 'job-2',
    title: 'Product Designer (Figma & Systems)',
    companyName: 'Angkor Creative',
    companyLogo: 'A',
    industry: 'Design & Marketing',
    location: 'Siem Reap, KH',
    type: 'Full-time',
    salary: '$2,500 - $3,500',
    experience: '3+ Years',
    description: 'Join our award-winning agency in historic Siem Reap or remote. You will design elegant design systems, clean web architectures, and mobile interfaces for international tech clients.',
    requirements: [
      'Portfolio showcasing clean geometric layouts, typography, and interactive prototypes.',
      'Proficiency in Figma component states, variables, and automated layout setups.',
      'Understanding of front-end styling rules (Tailwind grids, flex alignments).',
      'Excellent presentation skills with a design-thinking methodology.'
    ],
    benefits: [
      'Relocation assistance to beautiful, relaxed Siem Reap.',
      'Daily delicious catered lunches + creative studio access.',
      'Weekly tech-sharing sessions and mentorship courses.',
      'State-of-the-art MacBook Pro M3 and premium monitor provided.'
    ],
    postedAt: '1 day ago',
    featured: true
  },
  {
    id: 'job-3',
    title: 'Senior Full Stack Engineer',
    companyName: 'Sabaicode',
    companyLogo: 'S',
    industry: 'EdTech & Coding',
    location: 'Phnom Penh, KH',
    type: 'Full-time',
    salary: '$2,800 - $4,200',
    experience: '5+ Years',
    description: 'Help us revolutionize coding education in Cambodia. You will build highly interactive curriculum boards, live coding playgrounds, and grading systems.',
    requirements: [
      'Proficient in Node.js, Express, TypeScript, and React.',
      'Comfortable designing SQL databases and optimization strategies (Postgres/MySQL).',
      'Familiarity with containerized workflows (Docker, Cloud Run).',
      'Mentorship experience or passion for tutoring upcoming developers.'
    ],
    benefits: [
      'Make a real educational impact in the Kingdom of Cambodia.',
      'Flexible hours and generous paid time off (24 days/year).',
      'Full health, vision and mental wellness coverage.',
      'Fully paid trips to global tech summits.'
    ],
    postedAt: '3 days ago',
    featured: false
  },
  {
    id: 'job-4',
    title: 'Growth & Performance Marketer',
    companyName: 'Mango Byte',
    companyLogo: 'M',
    industry: 'SaaS Solutions',
    location: 'Remote (Worldwide)',
    type: 'Remote',
    salary: '$2,000 - $3,200',
    experience: '2+ Years',
    description: 'We are expanding our product reach globally. We need a creative growth marketer to drive paid acquisitions, search optimization, and drip campaigns.',
    requirements: [
      'Proven tracking records in building and debugging high-ROI ad sequences.',
      'Experience with tools like Google Analytics, Mixpanel, and SEMRush.',
      'Strong copycrafting skills and visual sensibilities.',
      'Self-driven remote specialist comfortable with async planning.'
    ],
    benefits: [
      '100% remote layout with a global digital nomad team.',
      'Home-office equipment reimbursement of $1,500.',
      'Bi-annual company retreats to tropical islands (Bali, Koh Rong).',
      'Performance-based cash bonuses.'
    ],
    postedAt: '4 days ago',
    featured: false
  },
  {
    id: 'job-5',
    title: 'React Native Developer',
    companyName: 'Glide Tech',
    companyLogo: 'G',
    industry: 'FinTech Platforms',
    location: 'Phnom Penh, KH',
    type: 'Contract',
    salary: '$40 - $65 / hour',
    experience: '3+ Years',
    description: 'Help modularize our mobile banking software using stable and highly optimized React Native architectures. This is a 6-month contract with a high probability of full renewal.',
    requirements: [
      'Extensive Native App development experience with fully customized UI bridges.',
      'Hands-on expertise in Reanimated, Gesture Handler, and Native state caches.',
      'Familiarity with app store deployment guidelines (Apple Connect, Play Console).'
    ],
    benefits: [
      'Higher hourly contract payout with zero-tax invoicing options.',
      'Access to prime building amenities (gym, swimming pool) in PP.',
      'Fully-stocked premium pantry access.',
      'High chance of performance transition to a full equity co-ownership.'
    ],
    postedAt: '5 days ago',
    featured: false
  },
  {
    id: 'job-6',
    title: 'Lead Product Product Manager',
    companyName: 'Kiri Tech',
    companyLogo: 'K',
    industry: 'Enterprise Solutions',
    location: 'Phnom Penh, KH',
    type: 'Full-time',
    salary: '$4,000 - $6,000',
    experience: '6+ Years',
    description: 'Lead the lifecycle of enterprise ERP suites that power Cambodia’s largest logistics, retail, and construction conglomerates.',
    requirements: [
      'Strong background leading complex enterprise SaaS lifecycles.',
      'Proven experience working with cross-functional technical teams (10+ people).',
      'Outstanding communication skills and stakeholder presentation fluency.'
    ],
    benefits: [
      'Executive-level USD compensation + yearly stock grants.',
      'Premium corporate car + private parking space.',
      'Elite health insurance with global emergency backup.',
      'Regular networking events with executive industry leaders.'
    ],
    postedAt: '1 week ago',
    featured: true
  }
];

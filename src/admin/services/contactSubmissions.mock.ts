/* src/admin/services/contactSubmissions.mock.ts */
import { ContactSubmission } from '../types/contact';

export const mockContactSubmissions: ContactSubmission[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@designstudio.com',
    company: 'Design Studio Co.',
    subject: 'UI/UX Design Project',
    message: 'We are looking for a senior software engineer to architect a high performance design system. Please send us your availability details.',
    date: 'Jan 15, 2024',
    status: 'open',
    avatarUrl: null
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'm.chen@techcorp.io',
    company: 'TechCorp Inc.',
    subject: 'Mobile App Development',
    message: 'Hello Ashok, we saw your portfolio and are interested in your React native mobile app services. Do you have consulting slots open this month?',
    date: 'Jan 14, 2024',
    status: 'reply_pending',
    avatarUrl: null
  },
  {
    id: '3',
    name: 'Elena Rostova',
    email: 'elena@creativeagency.net',
    company: 'Creative Agency',
    subject: 'Portfolio Review',
    message: 'Great portfolio website! We would love to feature your design process in our upcoming tech showcase article. Let us know if you are open to a brief interview.',
    date: 'Jan 12, 2024',
    status: 'replied',
    avatarUrl: null
  },
  {
    id: '4',
    name: 'David Beck',
    email: 'dbeck@startupxyz.com',
    company: 'Startup XYZ',
    subject: 'Backend API Project',
    message: 'We need help building a real-time analytics pipeline using Node.js and Postgres/Supabase. Saw your resume claims, let us hop on a call.',
    date: 'Jan 10, 2024',
    status: 'open',
    avatarUrl: null
  },
  {
    id: '5',
    name: 'Amanda Wall',
    email: 'amanda@enterprise.ca',
    company: 'Enterprise CA',
    subject: 'Analytics Integration',
    message: 'Our marketing dashboard needs a total redesign. Let us coordinate to review specs and milestones.',
    date: 'Jan 08, 2024',
    status: 'replied',
    avatarUrl: null
  },
  {
    id: '6',
    name: 'Jonathan Miller',
    email: 'jonathan@devops-scale.com',
    company: 'DevOps Scale',
    subject: 'Design System Build',
    message: 'Hi Ashok, we need to unify our product catalog styles. Your design system foundation matches our technology stack perfectly.',
    date: 'Jan 06, 2024',
    status: 'reply_pending',
    avatarUrl: null
  },
  {
    id: '7',
    name: 'Zoe Vance',
    email: 'zoe@vance-media.com',
    company: 'Vance Media Group',
    subject: 'Consulting Inquiry',
    message: 'Are you available to join our team as an advisor for a period of 6 months? We need advice on high fidelity animations.',
    date: 'Jan 04, 2024',
    status: 'replied',
    avatarUrl: null
  },
  {
    id: '8',
    name: 'Robert Stark',
    email: 'rstark@stark-tech.com',
    company: 'Stark Technology Inc.',
    subject: 'Next.js Application Refactor',
    message: 'We are seeking a React developer to optimize performance on our main customer facing catalog.',
    date: 'Jan 02, 2024',
    status: 'open',
    avatarUrl: null
  }
];

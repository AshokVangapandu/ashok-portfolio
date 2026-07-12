/* src/admin/pages/certifications/mockCertifications.ts */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  status: 'Published' | 'Draft' | 'Featured' | 'Expired' | 'Archived';
  thumbnailUrl: string;
}

export const MOCK_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert1',
    title: 'Mendix Advanced Developer',
    issuer: 'Mendix Academy',
    issueDate: 'Jan 2024',
    status: 'Published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cert2',
    title: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: 'Mar 2023',
    status: 'Published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cert3',
    title: 'Google UX Design Professional',
    issuer: 'Google',
    issueDate: 'Nov 2022',
    status: 'Published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cert4',
    title: 'React Developer Certification',
    issuer: 'Meta',
    issueDate: 'Aug 2023',
    status: 'Draft',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cert5',
    title: 'Figma Professional Design',
    issuer: 'Figma',
    issueDate: 'Feb 2023',
    status: 'Published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cert6',
    title: 'Certified Scrum Master',
    issuer: 'Scrum Alliance',
    issueDate: 'May 2021',
    status: 'Expired',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80'
  }
];

export const MOCK_SUMMARY = {
  total: 24,
  published: 18,
  draft: 4,
  featured: 6
};

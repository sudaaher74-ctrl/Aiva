import Contact from '@/views/Contact';

export const metadata = {
  title: 'Contact Us | AIVA Enterprises',
  description: 'Request a quote or sample from AIVA Enterprises. Reach our export desk in Navi Mumbai for bulk aseptic pulp, IQF fruit, and frozen vegetable inquiries.',
  openGraph: {
    title: 'Contact Us | AIVA Enterprises',
    description: 'Request a quote or sample from AIVA Enterprises. Reach our export desk in Navi Mumbai for bulk aseptic pulp, IQF fruit, and frozen vegetable inquiries.',
  },
  twitter: {
    title: 'Contact Us | AIVA Enterprises',
    description: 'Request a quote or sample from AIVA Enterprises. Reach our export desk in Navi Mumbai for bulk aseptic pulp, IQF fruit, and frozen vegetable inquiries.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <Contact />;
}

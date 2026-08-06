import About from '@/views/About';

export const metadata = {
  title: 'About Us | Premium Fruit Pulp Manufacturer | AIVA Enterprises',
  description: 'Meet AIVA Enterprises — founded by food technologist Aishwarya Ingale, building a transparent, certified global fruit pulp and IQF supply chain from India.',
  openGraph: {
    title: 'About Us | Premium Fruit Pulp Manufacturer',
    description: 'Meet AIVA Enterprises — founded by food technologist Aishwarya Ingale, building a transparent, certified global fruit pulp and IQF supply chain from India.',
  },
  twitter: {
    title: 'About Us | Premium Fruit Pulp Manufacturer',
    description: 'Meet AIVA Enterprises — founded by food technologist Aishwarya Ingale, building a transparent, certified global fruit pulp and IQF supply chain from India.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <About />;
}

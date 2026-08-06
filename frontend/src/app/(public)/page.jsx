import Home from '@/views/Home';
import MobileLayout from '@/components/mobile/MobileLayout';

export const metadata = {
  title: 'Premium Fruit Pulp Exporter India | AIVA Enterprises',
  description: 'AIVA Enterprises exports premium aseptic fruit pulps, purees, concentrates, and IQF fruits & vegetables from Navi Mumbai — 70 MT/day capacity, globally certified.',
  openGraph: {
    title: 'AIVA Enterprises - Premium Food Sourcing',
    description: 'AIVA Enterprises exports premium aseptic fruit pulps, purees, concentrates, and IQF fruits & vegetables from Navi Mumbai — 70 MT/day capacity, globally certified.',
  },
  twitter: {
    title: 'AIVA Enterprises - Premium Food Sourcing',
    description: 'AIVA Enterprises exports premium aseptic fruit pulps, purees, concentrates, and IQF fruits & vegetables from Navi Mumbai — 70 MT/day capacity, globally certified.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <Home />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </>
  );
}

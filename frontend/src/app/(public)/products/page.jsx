import Products from '@/views/Products';

export const metadata = {
  title: 'Premium Fruit Pulps & IQF Fruits | AIVA Enterprises',
  description: "Explore AIVA's range of aseptic mango, guava & tomato pulp, IQF fruits, and frozen vegetables — bulk export supply with custom packaging and specifications.",
  openGraph: {
    title: 'Premium Fruit Pulps & IQF Fruits',
    description: "Explore AIVA's range of aseptic mango, guava & tomato pulp, IQF fruits, and frozen vegetables — bulk export supply with custom packaging and specifications.",
  },
  twitter: {
    title: 'Premium Fruit Pulps & IQF Fruits',
    description: "Explore AIVA's range of aseptic mango, guava & tomato pulp, IQF fruits, and frozen vegetables — bulk export supply with custom packaging and specifications.",
  },
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsPage() {
  return <Products />;
}

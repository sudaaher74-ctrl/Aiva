import { productsData } from '@/data/products';
import { CATEGORIES } from '@/data/categories';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.aivaenterprises.com';

export default function sitemap() {
  const staticRoutes = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/products`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const categoryRoutes = CATEGORIES.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productRoutes = productsData.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

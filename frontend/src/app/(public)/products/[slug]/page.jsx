import Products from '@/views/Products';
import ProductDetail from '@/views/ProductDetail';
import { productsData } from '@/data/products';

export async function generateStaticParams() {
  const categories = ["aseptic", "concentrates", "iqf"];
  const productSlugs = productsData.map((p) => p.slug);
  const allSlugs = [...new Set([...categories, ...productSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export default async function ProductDynamicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const categories = ["aseptic", "concentrates", "iqf"];

  if (categories.includes(slug)) {
    return <Products categorySlug={slug} />;
  }

  return <ProductDetail />;
}

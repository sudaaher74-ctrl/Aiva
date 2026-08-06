import Products from '@/views/Products';
import ProductDetail from '@/views/ProductDetail';
import { productsData, getProductBySlug } from '@/data/products';
import { CATEGORIES, CATEGORY_ALIASES, CATEGORY_META, resolveCategorySlug } from '@/data/categories';

export async function generateStaticParams() {
  const productSlugs = productsData.map((p) => p.slug);
  const allSlugs = [...new Set([...CATEGORIES, ...Object.keys(CATEGORY_ALIASES), ...productSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const categorySlug = resolveCategorySlug(slug);

  if (categorySlug) {
    const meta = CATEGORY_META[categorySlug];
    const title = `${meta.title} | AIVA Enterprises`;
    return {
      title,
      description: meta.description,
      openGraph: { title, description: meta.description },
      twitter: { title, description: meta.description },
      alternates: { canonical: `/products/${categorySlug}` },
    };
  }

  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} | AIVA Enterprises`;
  const description = product.description || `Premium ${product.category} for global export from AIVA Enterprises.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [product.image] },
    twitter: { title, description, images: [product.image] },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductDynamicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const categorySlug = resolveCategorySlug(slug);

  if (categorySlug) {
    return <Products categorySlug={categorySlug} />;
  }

  return <ProductDetail />;
}

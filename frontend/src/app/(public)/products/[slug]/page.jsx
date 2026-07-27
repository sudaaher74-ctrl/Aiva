"use client";

import { useParams } from 'next/navigation';
import Products from '@/views/Products';
import ProductDetail from '@/views/ProductDetail';

export default function ProductDynamicPage() {
  const params = useParams();
  const slug = params?.slug;
  const categories = ["aseptic", "concentrates", "iqf"];

  if (categories.includes(slug)) {
    return <Products categorySlug={slug} />;
  }

  return <ProductDetail />;
}

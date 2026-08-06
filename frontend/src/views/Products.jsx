"use client";
import React, { useEffect } from 'react';
import {  usePathname  } from 'next/navigation';
import SEO from '../components/SEO';
import ProductHero from '../components/ProductHero';
import ProductGrid from '../components/ProductGrid';
import { CATEGORY_META } from '../data/categories';
import { productsData } from '../data/products';

import BulkInquiry from '../components/BulkInquiry';

function Products({ categorySlug }) {
  const location = usePathname();
  const category = categorySlug ? CATEGORY_META[categorySlug] : null;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": category ? category.title : "AIVA Products",
    "itemListElement": (category
      ? productsData.filter((p) => p.tab === categorySlug)
      : productsData.slice(0, 10)
    ).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "description": p.description,
        "image": `https://www.aivaenterprises.com${p.image}`,
        "brand": { "@type": "Brand", "name": "AIVA Enterprises" },
      },
    })),
  };

  useEffect(() => {
    // If there's a hash in the URL, try to scroll to it
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for products to load
    } else if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <SEO jsonLd={[itemListSchema]} />
      <ProductHero />
      {category && (
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 20px', textAlign: 'center' }}>
          <p className="text-light-dim">{category.intro}</p>
        </div>
      )}
      <ProductGrid categorySlug={categorySlug} />

      <BulkInquiry />
    </>
  );
}

export default Products;

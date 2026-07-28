"use client";
import React, { useEffect } from 'react';
import {  usePathname  } from 'next/navigation';
import SEO from '../components/SEO';
import ProductHero from '../components/ProductHero';
import ProductGrid from '../components/ProductGrid';

import BulkInquiry from '../components/BulkInquiry';

function Products({ categorySlug }) {
  const location = usePathname();

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
      <SEO 
        title="Premium Fruit Pulps & IQF Fruits"
        description="Explore our premium range of aseptic fruit pulps (Alphonso Mango, Totapuri, Pink Guava) and IQF fruits & vegetables for B2B export."
        canonicalUrl="/products"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Alphonso Mango Pulp",
            "image": "https://www.aivaenterprises.com/assets/images/products/pulp/Alphonsomangopulp.webp",
            "description": "Premium Aseptic Alphonso Mango Pulp for B2B manufacturing.",
            "brand": {
              "@type": "Brand",
              "name": "AIVA Enterprises"
            }
          }
        ]}
      />
      <ProductHero />
      <ProductGrid categorySlug={categorySlug} />

      <BulkInquiry />
    </>
  );
}

export default Products;

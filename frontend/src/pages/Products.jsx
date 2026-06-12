import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductHero from '../components/ProductHero';
import ProductGrid from '../components/ProductGrid';
import StandardsSection from '../components/StandardsSection';
import BulkInquiry from '../components/BulkInquiry';

function Products() {
  const location = useLocation();

  useEffect(() => {
    // If there's a hash in the URL, try to scroll to it
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for products to load
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <>
      <ProductHero />
      <ProductGrid />
      <StandardsSection />
      <BulkInquiry />
    </>
  );
}

export default Products;

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productsData } from '../data/products';
import { API_BASE } from '../config';
gsap.registerPlugin(ScrollTrigger);

function ProductGrid({ categorySlug }) {
  // Initialize with static data for SSG
  const [products, setProducts] = useState(productsData);
  const location = useLocation();
  const gridsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchProducts = async () => {
      try {

        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          // Merge or replace static data with fresh backend data
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to load products, using static data:', error);
      }
    };
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (typeof window === 'undefined') return;
    
    if (products.length > 0) {
      setTimeout(() => {
        gsap.utils.toArray('.premium-prod-card').forEach((card) => {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          );
        });
        ScrollTrigger.refresh();
      }, 100);
    }
  }, { dependencies: [products, location.hash, categorySlug], scope: gridsRef });

  const handleQuoteClick = (imgSource) => {
    if (typeof window === 'undefined') return;
    const inquiryImg = document.querySelector('.inquiry-img img');
    if (inquiryImg) {
      inquiryImg.src = imgSource;
      gsap.fromTo(
        inquiryImg,
        { scale: 0.9, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  };

  const getVisibleCategory = () => {
    // If we have a route param (e.g. /products/aseptic), prefer it
    if (categorySlug) {
      if (categorySlug === 'concentrates') return 'concentrates';
      if (categorySlug === 'iqf') return 'iqf-fruits';
      return categorySlug;
    }
    
    const hash = location.hash || '#aseptic';
    if (hash === '#iqf-fruits') return 'iqf-fruits';
    if (hash === '#iqf-frozen') return 'iqf-frozen';
    if (hash === '#vegetables') return 'vegetables';
    if (hash === '#concentrates') return 'concentrates';
    return 'aseptic';
  };

  const visibleCategory = getVisibleCategory();

  const renderGrid = (category, title) => {
    const filtered = products.filter((p) => {
      if (category === 'iqf-fruits') return p.tab === 'iqf-fruits' || p.tab === 'iqf';
      return p.tab === category;
    });
    if (visibleCategory !== category) return null;

    const getImageUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('./')) return url.substring(1);
      return url;
    };

    return (
      <section className="prod-grid-section section-padding" id={category}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title text-light">{title}</h2>
          </div>
          <div className="premium-product-grid">
            {filtered.map((product) => (
              <ProductCard 
                key={product._id || product.id} 
                product={product} 
                handleQuoteClick={handleQuoteClick} 
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div ref={gridsRef}>
      {renderGrid('aseptic', 'Aseptic pulp/paste')}
      {renderGrid('concentrates', 'Concentrates')}
      {renderGrid('iqf-fruits', 'IQF fruits')}
      {renderGrid('iqf-frozen', 'Frozen')}
      {renderGrid('vegetables', 'IQF Vegetables')}
    </div>
  );
}

export default ProductGrid;

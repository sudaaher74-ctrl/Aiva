"use client";
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProductCard from './ProductCard';
import { productsData } from '../data/products';
import { API_BASE } from '../config';
gsap.registerPlugin(ScrollTrigger);

function ProductGrid({ categorySlug }) {
  // Initialize with static data for SSG
  const [products, setProducts] = useState(productsData);
  const location = usePathname();
  const gridsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchProducts = async () => {
      try {

        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          // Merge backend data with static image paths since they were recently updated
          const mergedData = data.data.map(backendProduct => {
            const staticMatch = productsData.find(p => p.name === backendProduct.name);
            if (staticMatch) {
              return { 
                ...backendProduct, 
                image: staticMatch.image || backendProduct.image,
                tab: backendProduct.tab || staticMatch.tab 
              };
            }
            return backendProduct;
          });
          
          // Append any static products that might not be in the backend yet (like the new Frozen products)
          const backendNames = new Set(data.data.map(p => p.name));
          const missingStatic = productsData.filter(p => !backendNames.has(p.name));
          
          setProducts([...mergedData, ...missingStatic]);
        }
      } catch (error) {
        console.error('Failed to load products, using static data:', error);
      }
    };
    fetchProducts();
  }, []);



  const [activeCategory, setActiveCategory] = useState('aseptic');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getHashCategory = () => {
      if (categorySlug) {
        if (categorySlug === 'concentrates') return 'concentrates';
        if (categorySlug === 'iqf') return 'iqf-fruits';
        return categorySlug;
      }
      const hash = window.location.hash || '#aseptic';
      if (hash === '#iqf-fruits') return 'iqf-fruits';
      if (hash === '#iqf-frozen') return 'iqf-frozen';
      if (hash === '#vegetables') return 'vegetables';
      if (hash === '#concentrates') return 'concentrates';
      return 'aseptic';
    };

    setActiveCategory(getHashCategory());

    const handleHashChange = () => {
      setActiveCategory(getHashCategory());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categorySlug]);

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
  }, { dependencies: [products, activeCategory, categorySlug], scope: gridsRef });

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

  const categoriesList = [
    { id: 'aseptic', label: 'Aseptic pulp/paste' },
    { id: 'concentrates', label: 'Concentrates' },
    { id: 'iqf-fruits', label: 'IQF fruits' },
    { id: 'iqf-frozen', label: 'Frozen' },
    { id: 'vegetables', label: 'IQF Vegetables' },
  ];

  const handleTabClick = (id) => {
    setActiveCategory(id);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const renderGrid = (category, title) => {
    const filtered = products.filter((p) => {
      if (category === 'iqf-fruits') return p.tab === 'iqf-fruits' || p.tab === 'iqf';
      return p.tab === category;
    });
    if (activeCategory !== category) return null;

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
      <div className="product-category-tabs">
        {categoriesList.map(cat => (
          <button 
            key={cat.id} 
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleTabClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {renderGrid('aseptic', 'Aseptic pulp/paste')}
      {renderGrid('concentrates', 'Concentrates')}
      {renderGrid('iqf-fruits', 'IQF fruits')}
      {renderGrid('iqf-frozen', 'Frozen')}
      {renderGrid('vegetables', 'IQF Vegetables')}
    </div>
  );
}

export default ProductGrid;

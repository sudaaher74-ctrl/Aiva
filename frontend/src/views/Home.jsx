"use client";
import React, { useEffect } from 'react';
import {  usePathname  } from 'next/navigation';
import SEO from '../components/SEO';
import HomeHero from '../components/HomeHero';
import AboutSection from '../components/AboutSection';
import ProductCategories from '../components/ProductCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessSection from '../components/ProcessSection';
import GlobalExport from '../components/GlobalExport';
import ContactSection from '../components/ContactSection';
import useSectionSnap from '../hooks/useSectionSnap';

function Home() {
  const location = usePathname();

  useSectionSnap();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <>
      <SEO 
        title="Premium Fruit Pulp Exporter India"
        description="AIVA Enterprises is a leading India-based exporter of premium fruit pulps (Mango, Guava, Papaya), concentrates, tomato paste, and IQF fruits & vegetables globally."
        canonicalUrl=""
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AIVA Enterprises",
            "url": "https://www.aivaenterprises.com/",
            "logo": "https://www.aivaenterprises.com/assets/images/products/newlogo.webp",
            "description": "Premium Fruit Pulp Manufacturer & Exporter",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "CBD Belapur, Navi Mumbai",
              "addressRegion": "Maharashtra",
              "addressCountry": "IN"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AIVA Enterprises",
            "url": "https://www.aivaenterprises.com/"
          }
        ]}
      />
      <div className="fullscreen-section"><HomeHero /></div>
      <div className="fullscreen-section"><AboutSection /></div>
      <div className="fullscreen-section"><ProductCategories /></div>
      <div className="fullscreen-section"><WhyChooseUs /></div>
      <div className="fullscreen-section"><ProcessSection /></div>
      <div className="fullscreen-section"><GlobalExport /></div>
      <div className="fullscreen-section"><ContactSection /></div>
    </>
  );
}

export default Home;

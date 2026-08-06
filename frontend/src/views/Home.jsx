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

function Home() {
  const location = usePathname();

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
        jsonLd={[
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

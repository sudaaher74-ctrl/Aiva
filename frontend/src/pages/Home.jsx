import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HomeHero from '../components/HomeHero';
import AboutSection from '../components/AboutSection';
import ProductCategories from '../components/ProductCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessSection from '../components/ProcessSection';
import GlobalExport from '../components/GlobalExport';
import ContactSection from '../components/ContactSection';

function Home() {
  const location = useLocation();

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
      <Helmet>
        <title>AIVA Enterprises | Premium Export Quality Products</title>
        <meta name="description" content="AIVA Enterprises exports premium quality fruit pulps, frozen fruits, and vegetables globally." />
      </Helmet>
      <HomeHero />
      <AboutSection />
      <ProductCategories />
      <WhyChooseUs />
      <ProcessSection />
      <GlobalExport />
      <ContactSection />
    </>
  );
}

export default Home;

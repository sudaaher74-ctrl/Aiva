import React from 'react';
import HomeHero from '../components/HomeHero';
import AboutSection from '../components/AboutSection';
import ProductCategories from '../components/ProductCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessSection from '../components/ProcessSection';
import GlobalExport from '../components/GlobalExport';
import ContactSection from '../components/ContactSection';

function Home() {
  return (
    <>
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

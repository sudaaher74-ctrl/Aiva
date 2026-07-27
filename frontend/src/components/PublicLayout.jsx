"use client";

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from './Preloader';
import MobileBottomNav from './MobileBottomNav';

const PublicLayout = ({ children }) => {
  return (
    <>
      <Preloader />
      <Navbar />
      {children}
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PublicLayout;

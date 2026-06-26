import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from './Preloader';
import MobileBottomNav from './MobileBottomNav';

const PublicLayout = () => {
  return (
    <>
      <Preloader />
      <Navbar />
      <Outlet />
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PublicLayout;

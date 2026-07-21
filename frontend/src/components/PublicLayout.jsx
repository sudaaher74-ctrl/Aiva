import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from './Preloader';
import MobileBottomNav from './MobileBottomNav';
import ComingSoon from './ComingSoon';

const PublicLayout = () => {
  return (
    <>
      <Preloader />
      <ComingSoon />
      <Navbar />
      <Outlet />
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PublicLayout;

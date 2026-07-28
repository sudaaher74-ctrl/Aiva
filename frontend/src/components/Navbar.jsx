"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (e, hash) => {
    closeMenu();
    if (typeof window !== 'undefined' && window.location.pathname === '/products') {
      e.preventDefault();
      window.location.hash = hash;
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo" onClick={closeMenu}>
          <img
            src="/assets/images/products/newlogo.webp"
            alt="AIVA Enterprises Logo"
            className="logo-img"
          />
        </Link>
        <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link href="/#home" onClick={closeMenu}>Home</Link>
          <div className="nav-dropdown">
            <Link href="/products" className="dropdown-toggle" onClick={closeMenu}>
              Products <i className="ph ph-caret-down"></i>
            </Link>
            <div className="dropdown-menu">
              <Link href="/products#aseptic" onClick={(e) => handleNavClick(e, '#aseptic')}>Aseptic pulp/paste</Link>
              <Link href="/products#concentrates" onClick={(e) => handleNavClick(e, '#concentrates')}>Concentrates</Link>
              <Link href="/products#iqf-fruits" onClick={(e) => handleNavClick(e, '#iqf-fruits')}>IQF fruits</Link>
              <Link href="/products#iqf-frozen" onClick={(e) => handleNavClick(e, '#iqf-frozen')}>Frozen</Link>
              <Link href="/products#vegetables" onClick={(e) => handleNavClick(e, '#vegetables')}>IQF Vegetables</Link>
            </div>
          </div>
          <Link href="/about" onClick={closeMenu}>About Us</Link>
          <Link href="/#contact" onClick={closeMenu}>Contact</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/#contact" className="btn btn-outline" onClick={closeMenu}>
            Contact Us
          </Link>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            <i className={`ph ${isOpen ? 'ph-x' : 'ph-list'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

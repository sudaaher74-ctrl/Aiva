import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="/assets/images/products/newlogo.webp"
            alt="AIVA Enterprises Logo"
            className="logo-img"
          />
        </Link>
        <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/#home" onClick={closeMenu}>Home</Link>
          <div className="nav-dropdown">
            <Link to="/products" className="dropdown-toggle" onClick={closeMenu}>
              Products <i className="ph ph-caret-down"></i>
            </Link>
            <div className="dropdown-menu">
              <Link to="/products#aseptic" onClick={closeMenu}>Aseptic pulp/paste</Link>
              <Link to="/products#iqf-fruits" onClick={closeMenu}>IQF fruits</Link>
              <Link to="/products#iqf-frozen" onClick={closeMenu}>Frozen</Link>
              <Link to="/products#vegetables" onClick={closeMenu}>IQF Vegetables</Link>
            </div>
          </div>
          <Link to="/#about" onClick={closeMenu}>About Us</Link>
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>
          <ThemeToggle className="theme-toggle--mobile" />
        </nav>
        <div className="nav-actions">
          <ThemeToggle className="theme-toggle--desktop" />
          <Link to="/#contact" className="btn btn-outline" onClick={closeMenu}>
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

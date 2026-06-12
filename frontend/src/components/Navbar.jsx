import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img
            src="/assets/images/products/newlogo.webp"
            alt="AIVA Enterprises Logo"
            style={{
              height: '140px',
              width: 'auto',
              objectFit: 'contain',
              transform: 'scale(1.2)',
              transformOrigin: 'left center',
            }}
          />
        </Link>
        <nav className="nav-links">
          <Link to="/#home">Home</Link>
          <div className="nav-dropdown">
            <Link to="/products" className="dropdown-toggle">
              Products <i className="ph ph-caret-down"></i>
            </Link>
            <div className="dropdown-menu">
              <Link to="/products#aseptic">Aseptic pulp/paste</Link>
              <Link to="/products#iqf-fruits">IQF fruits</Link>
              <Link to="/products#iqf-frozen">Frozen</Link>
              <Link to="/products#vegetables">IQF Vegetables</Link>
            </div>
          </div>
          <Link to="/#about">About Us</Link>
          <Link to="#contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          <Link to="#contact" className="btn btn-outline">
            Contact Us
          </Link>
          <button className="mobile-toggle">
            <i className="ph ph-list"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

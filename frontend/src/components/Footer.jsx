import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="footer hidden md:block">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>AIVA</h2>
            <p>Premium Fruit Pulp & Juice Exporters.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link href="/about">About Us</Link>
            <Link href="/products">Products</Link>
            <Link href="/about#certifications">Certifications</Link>
            <Link href="#contact">Contact</Link>
          </div>
          <div className="footer-social">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#">
                <i className="ph ph-linkedin-logo"></i>
              </a>
              <a href="#">
                <i className="ph ph-instagram-logo"></i>
              </a>
              <a href="https://wa.me/918828177533" target="_blank" rel="noopener noreferrer">
                <i className="ph ph-whatsapp-logo"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 AIVA Enterprises. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Trade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

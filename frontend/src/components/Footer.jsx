import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>AIVA</h2>
            <p>Premium Fruit Pulp & Juice Exporters.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/#about">About Us</Link>
            <Link to="/products">Products</Link>
            <Link to="/#quality">Certifications</Link>
            <Link to="#contact">Contact</Link>
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
              <a href="#">
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

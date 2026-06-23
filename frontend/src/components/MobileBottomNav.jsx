import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function MobileBottomNav() {
  const location = useLocation();

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.includes('#')) {
      return location.hash === path.substring(path.indexOf('#'));
    }
    return location.pathname === path;
  };

  return (
    <div className="mobile-bottom-nav-wrapper">
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} title="Home">
          <i className="ph ph-house"></i>
        </Link>
        
        <Link to="/products" className={`nav-item ${isActive('/products') ? 'active' : ''}`} title="Products">
          <i className="ph ph-package"></i>
        </Link>

        {/* Using a clipboard/file icon for Quote to match the request */}
        <Link to="/#contact" className={`nav-item ${isActive('#contact') ? 'active' : ''}`} title="Quote">
          <i className="ph ph-clipboard-text"></i>
        </Link>

        {/* Contact icon */}
        <Link to="/#contact" className={`nav-item ${isActive('#contact') ? 'active' : ''}`} title="Contact">
          <i className="ph ph-user"></i>
        </Link>
      </nav>
    </div>
  );
}

export default MobileBottomNav;

"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function MobileBottomNav() {
  const pathname = usePathname();

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    if (path.includes('#')) {
      return false; // hash routing not tracked server-side
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="mobile-bottom-nav-wrapper">
      <nav className="mobile-bottom-nav">
        <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} title="Home">
          <i className="ph ph-house"></i>
        </Link>
        
        <Link href="/products" className={`nav-item ${isActive('/products') ? 'active' : ''}`} title="Products">
          <i className="ph ph-package"></i>
        </Link>

        {/* Using a clipboard/file icon for Quote to match the request */}
        <Link href="/#contact" className={`nav-item ${isActive('#contact') ? 'active' : ''}`} title="Quote">
          <i className="ph ph-clipboard-text"></i>
        </Link>

        {/* Contact icon */}
        <Link href="/#contact" className={`nav-item ${isActive('#contact') ? 'active' : ''}`} title="Contact">
          <i className="ph ph-user"></i>
        </Link>
      </nav>
    </div>
  );
}

export default MobileBottomNav;

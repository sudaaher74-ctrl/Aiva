'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import HomeMobile from './views/HomeMobile';
import CatalogueMobile from './views/CatalogueMobile';
import ProcessMobile from './views/ProcessMobile';
import ContactMobile from './views/ContactMobile';
import AboutMobile from './views/AboutMobile';
import ProductDetailMobile from './views/ProductDetailMobile';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <div className="bg-[var(--c-black)] min-h-screen text-[var(--c-white)] font-sans relative selection:bg-[linear-gradient(90deg,#ffb800,#ff8a00)]/20 overflow-x-hidden">
      
      {/* Dynamic View Rendering */}
      <main className="w-full flex-1">
        {activeTab === 'home' && <HomeMobile setActiveTab={setActiveTab} />}
        {activeTab === 'catalogue' && <CatalogueMobile onProductClick={setActiveProduct} />}
        {activeTab === 'process' && <ProcessMobile setActiveTab={setActiveTab} />}
        {activeTab === 'contact' && <ContactMobile />}
        {activeTab === 'about' && <AboutMobile />}
      </main>

      {/* Product Detail Overlay */}
      <AnimatePresence>
        {activeProduct && (
          <ProductDetailMobile 
            product={activeProduct} 
            onBack={() => setActiveProduct(null)} 
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

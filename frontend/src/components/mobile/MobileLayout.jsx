'use client';

import React, { useState } from 'react';
import BottomNav from './BottomNav';
import HomeMobile from './views/HomeMobile';
import CatalogueMobile from './views/CatalogueMobile';
import ProcessMobile from './views/ProcessMobile';
import AboutMobile from './views/AboutMobile';

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="bg-mobile-bg min-h-screen text-mobile-green font-sans relative selection:bg-mobile-orange/20 overflow-x-hidden">
      
      {/* Dynamic View Rendering */}
      <main className="pb-28">
        {activeTab === 'home' && <HomeMobile setActiveTab={setActiveTab} />}
        {activeTab === 'catalogue' && <CatalogueMobile />}
        {activeTab === 'process' && <ProcessMobile setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <AboutMobile />}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

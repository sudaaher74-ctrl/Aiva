'use client';

import React from 'react';
import { Home, LayoutGrid, BarChart2, Info } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'catalogue', label: 'Catalogue', icon: LayoutGrid },
    { id: 'process', label: 'Process', icon: BarChart2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[360px] bg-white/95 backdrop-blur-xl rounded-full shadow-premium flex items-center justify-between px-2 py-2 z-50 border border-white/20">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300 relative ${
              isActive ? 'text-mobile-orange' : 'text-mobile-green/50 hover:text-mobile-green'
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 border-[1.5px] border-mobile-orange rounded-full opacity-100" />
            )}
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
            <span className="text-[10px] font-sans font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

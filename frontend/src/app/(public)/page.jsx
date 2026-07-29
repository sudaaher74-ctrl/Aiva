"use client";

import Home from '@/views/Home';
import MobileLayout from '@/components/mobile/MobileLayout';

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <Home />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </>
  );
}

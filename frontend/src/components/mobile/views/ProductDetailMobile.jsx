'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function ProductDetailMobile({ product, onBack }) {
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-40 bg-mobile-bg overflow-y-auto pb-32"
    >
      <div className="px-6 pt-14 pb-8">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="bg-white hover:bg-gray-50 flex items-center gap-1.5 px-4 py-2 rounded-full shadow-sm text-mobile-green font-sans font-bold text-[11px] uppercase tracking-wider mb-8 transition-colors active:scale-95"
        >
          <ChevronLeft size={14} strokeWidth={3} />
          Catalogue
        </button>

        {/* Product Image */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full flex justify-center mb-10 relative"
        >
          {/* Subtle glow behind the image */}
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-75" />
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-[85%] max-w-[320px] object-contain drop-shadow-2xl relative z-10"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Category Pill */}
          <div className="inline-block bg-[#E5F1E9] text-[#4A6451] px-3 py-1 rounded-full font-sans font-extrabold text-[9px] uppercase tracking-widest mb-4">
            {product.category || 'ASEPTIC'}
          </div>

          <h1 className="font-serif font-black text-4xl text-mobile-green leading-[1.05] mb-4 tracking-tight">
            {product.name}
          </h1>

          <p className="font-sans text-mobile-green/60 text-[13px] font-medium leading-relaxed pr-4 mb-8 text-balance">
            {product.description}
          </p>

          {/* Grid Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="font-sans text-[9px] font-bold text-mobile-green/40 uppercase tracking-widest mb-1">BRIX</p>
              <p className="font-sans text-sm font-black text-mobile-green">16–18°</p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="font-sans text-[9px] font-bold text-mobile-green/40 uppercase tracking-widest mb-1">PACKING</p>
              <p className="font-sans text-sm font-black text-mobile-green">215 kg drum</p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="font-sans text-[9px] font-bold text-mobile-green/40 uppercase tracking-widest mb-1">SHELF LIFE</p>
              <p className="font-sans text-sm font-black text-mobile-green">18–24 months</p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="font-sans text-[9px] font-bold text-mobile-green/40 uppercase tracking-widest mb-1">ORIGIN</p>
              <p className="font-sans text-sm font-black text-mobile-green">India</p>
            </div>
          </div>

          {/* Certifications Block */}
          <div className="bg-[#EAE0D3] rounded-[24px] p-5 shadow-inner mb-8">
            <p className="font-sans text-[10px] font-bold text-[#C67139] uppercase tracking-widest mb-3">CERTIFIED UNDER</p>
            <div className="flex flex-wrap gap-2">
              {['FSSAI', 'APEDA', 'BRC', 'FSSC 22000', 'ISO 22000', 'ISO 14001', 'GLOBALG.A.P.', 'Halal', 'Kosher', 'SGF', 'AQA'].map((cert, i) => (
                <div key={i} className="bg-white px-3 py-1.5 rounded-full font-sans font-bold text-[10px] text-mobile-green shadow-sm">
                  {cert}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#C67139] hover:bg-[#b0612f] text-white py-4 rounded-full font-sans font-bold text-[13px] shadow-[0_4px_15px_rgba(198,113,57,0.3)] active:scale-95 transition-all">
              Request specification sheet
            </button>
            <button className="w-full bg-transparent border-2 border-[#EAE0D3] hover:bg-[#EAE0D3] text-mobile-green py-4 rounded-full font-serif font-black text-[15px] tracking-tight active:scale-95 transition-all">
              Talk to the export desk
            </button>
          </div>
          
        </motion.div>
      </div>
    </motion.div>
  );
}

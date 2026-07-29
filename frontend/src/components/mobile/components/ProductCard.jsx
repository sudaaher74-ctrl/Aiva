'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="bg-[#121212] rounded-[32px] p-4 flex flex-col items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.05)] aspect-[4/5] relative overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-transparent pointer-events-none" />
      
      <div className="w-full flex-1 flex items-center justify-center relative mb-4">
        <motion.img
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain max-h-[140px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="w-full mt-auto">
        <p className="text-[10px] font-sans font-bold text-[#ffffff]/50 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="font-serif font-bold text-[#ffffff] text-sm leading-tight text-balance">
          {product.name}
        </h3>
      </div>
    </motion.div>
  );
}

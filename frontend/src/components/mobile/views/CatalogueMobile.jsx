'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsData } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function CatalogueMobile({ onProductClick }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'aseptic', label: 'Aseptic' },
    { id: 'iqf-fruits', label: 'IQF fruit' },
    { id: 'vegetables', label: 'Vegetables' },
  ];

  const filteredProducts = productsData.filter((p) => {
    const matchesFilter = filter === 'all' || p.tab === filter || p.category.toLowerCase() === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen pt-12 pb-8 px-6">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-sans text-[10px] font-bold text-[#F4A300] uppercase tracking-widest mb-2">
          {filteredProducts.length} PRODUCTS
        </p>
        <h1 className="font-serif font-black text-5xl text-[#ffffff] mb-6">Catalogue</h1>

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#ffffff]/40" />
          </div>
          <input
            type="text"
            placeholder="Search mango, guava, IQF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] rounded-full py-4 pl-12 pr-4 font-sans text-sm text-[#ffffff] placeholder:text-[#ffffff]/40 outline-none shadow-sm focus:shadow-md transition-shadow"
          />
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 pb-6 hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-sans text-sm font-bold transition-all ${
                filter === f.id
                  ? 'bg-[linear-gradient(90deg,#ffb800,#ff8a00)] text-white shadow-md'
                  : 'bg-[#121212] text-[#ffffff] hover:bg-[#121212]/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 gap-4 pb-12"
      >
        <AnimatePresence>
          {filteredProducts.map((p) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={p.id}
            >
              <ProductCard product={p} onClick={() => onProductClick && onProductClick(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
    </div>
  );
}

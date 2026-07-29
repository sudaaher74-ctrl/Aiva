'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import Image from 'next/image';

export default function HomeMobile({ setActiveTab }) {
  
  const categories = [
    { id: 'aseptic', name: 'Aseptic pulp & paste', count: '5 products', image: '/assets/images/products/pulp/totapurimango.png' },
    { id: 'iqf', name: 'IQF fruit', count: '2 products', image: '/assets/images/products/iqf_fruits/strawberry.png' },
    { id: 'vegetables', name: 'Vegetables', count: '2 products', image: '/assets/images/products/vegetables/green-peas.png' }
  ];

  return (
    <div className="flex flex-col w-full h-full pb-8">
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 relative overflow-hidden bg-gradient-to-b from-mobile-bg to-mobile-bg/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="font-serif font-black text-mobile-green text-xl tracking-tight leading-none">AIVA Enterprises</h1>
            <p className="font-sans text-[9px] text-mobile-green/50 font-bold uppercase tracking-widest mt-1">
              NAVI MUMBAI · INDIA
            </p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-mobile-orange">
            <Globe size={18} strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="font-serif font-black text-[42px] leading-[1.05] text-[#2F2923] mb-5 tracking-tight">
            The standard <br />behind <span className="text-[#C67139]">the</span><br /><span className="text-[#C67139]">standard.</span>
          </h2>
          <p className="font-sans text-[#7A756C] text-sm leading-relaxed mb-7 max-w-[280px] font-medium">
            Aseptic pulps, purées, concentrates and IQF produce — grown in India, shipped in bulk to the world.
          </p>
          
          <button 
            onClick={() => setActiveTab('catalogue')}
            className="bg-[#C67139] text-white px-7 py-3.5 rounded-full font-sans font-bold text-sm shadow-[0_4px_14px_rgba(198,113,57,0.3)] active:scale-95 transition-transform"
          >
            Explore the range
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="mt-8 relative w-full flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/assets/images/home.png" alt="AIVA Products" className="w-[110%] max-w-[400px] object-contain drop-shadow-xl" />
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="px-5 pb-6 grid grid-cols-3 gap-3">
        {[
          { stat: '70 MT', label: 'Aseptic capacity per day' },
          { stat: '11', label: 'Global certifications' },
          { stat: '25+', label: 'Export-ready SKUs' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col items-start justify-center aspect-[4/3]"
          >
            <h3 className="font-serif font-black text-mobile-orange text-[22px] mb-1">{item.stat}</h3>
            <p className="font-sans text-[9px] text-mobile-green/60 leading-[1.2] font-semibold pr-2">{item.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="pt-8 pb-4">
        <div className="flex justify-between items-end px-6 mb-6">
          <h3 className="font-serif font-black text-3xl text-mobile-green tracking-tight">Categories</h3>
          <button onClick={() => setActiveTab('catalogue')} className="font-sans text-mobile-orange font-bold text-sm pb-1">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {categories.map((c, i) => (
            <div key={c.id} className="min-w-[150px] w-[150px] snap-center bg-[#EBE0CF] rounded-[32px] p-5 flex flex-col shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]">
               <div className="w-full aspect-[4/5] bg-[#0A0A0A] rounded-2xl mb-4 p-2 flex items-center justify-center overflow-hidden relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
               </div>
               <h4 className="font-sans font-bold text-mobile-green text-[13px] leading-tight mb-1">{c.name}</h4>
               <p className="font-sans text-[10px] text-mobile-green/50 font-semibold">{c.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Highlight */}
      <section className="px-5 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-mobile-green rounded-[32px] p-7 text-white relative overflow-hidden"
        >
          {/* Decorative subtle circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5539] rounded-full -translate-y-1/3 translate-x-1/4" />
          
          <div className="relative z-10">
            <p className="font-sans text-[9px] font-bold tracking-widest text-white/50 mb-3 uppercase">OUR PROCESS</p>
            <h3 className="font-serif font-black text-[32px] leading-[1.05] mb-8 text-balance">
              From orchard <br/>to ocean
            </h3>

            <div className="space-y-4 mb-8">
              {['Harvesting & selection', 'Sorting & washing', 'Extraction & processing', 'Packaging & storage'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-serif text-[11px] font-bold text-white/70">
                    {i + 1}
                  </div>
                  <span className="font-sans text-[13px] font-medium text-white/90">{step}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setActiveTab('process')}
              className="bg-[#F5EAD8] text-[#2F2923] px-6 py-3 rounded-full font-sans font-bold text-[13px] hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              See how it works
            </button>
          </div>
        </motion.div>
      </section>

      {/* In Season Header */}
      <section className="px-6 pb-24">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-serif font-black text-3xl text-mobile-green tracking-tight">In season</h3>
          <button onClick={() => setActiveTab('catalogue')} className="font-sans text-mobile-orange font-bold text-sm pb-1">Catalogue</button>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-sm h-32 flex items-center justify-center text-mobile-green/40 font-sans text-sm font-medium">
           Products will appear here
        </div>
      </section>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { productsData } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Globe, CheckCircle2 } from 'lucide-react';

export default function HomeMobile({ setActiveTab }) {
  const featuredProducts = productsData.slice(0, 3); // Get 3 products

  return (
    <div className="flex flex-col w-full h-full pb-8">
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 relative overflow-hidden bg-gradient-to-b from-[#EFE1CC] to-mobile-bg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-serif font-black text-mobile-green text-lg tracking-tight">AIVA Enterprises</h1>
            <p className="font-sans text-[10px] text-mobile-green/60 font-bold uppercase tracking-widest mt-1">
              Navi Mumbai • India
            </p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-mobile-orange">
            <Globe size={18} strokeWidth={2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="font-serif font-black text-5xl leading-[0.95] text-mobile-green mb-6 tracking-tight">
            The standard <br />behind <span className="text-mobile-orange">the<br />standard.</span>
          </h2>
          <p className="font-sans text-mobile-green/70 text-sm leading-relaxed mb-8 max-w-[280px]">
            Aseptic pulps, purées, concentrates and IQF produce — grown in India, shipped in bulk to the world.
          </p>
          
          <button 
            onClick={() => setActiveTab('catalogue')}
            className="bg-mobile-orange text-white px-8 py-4 rounded-full font-sans font-bold text-sm shadow-[0_8px_20px_rgba(198,113,57,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Explore the range
          </button>
        </motion.div>

        {/* Hero Image / Illustration */}
        <motion.div 
          className="mt-12 relative h-[250px] w-full flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Using a product composition */}
          <div className="absolute inset-0 bg-[url('/assets/images/products/pulp/alphonso.png')] bg-contain bg-center bg-no-repeat opacity-90 drop-shadow-2xl scale-110" />
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="px-4 py-4 grid grid-cols-3 gap-3">
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
            className="bg-white rounded-3xl p-4 shadow-sm flex flex-col justify-center items-center text-center aspect-square"
          >
            <h3 className="font-serif font-black text-mobile-orange text-2xl mb-1">{item.stat}</h3>
            <p className="font-sans text-[9px] text-mobile-green/70 leading-tight font-medium">{item.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="pt-8 pb-4">
        <div className="flex justify-between items-end px-6 mb-6">
          <h3 className="font-serif font-black text-3xl text-mobile-green">Categories</h3>
          <button onClick={() => setActiveTab('catalogue')} className="font-sans text-mobile-orange font-bold text-sm hover:opacity-80">See all</button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {featuredProducts.map((p, i) => (
            <div key={p.id} className="min-w-[140px] w-[140px] snap-center">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Process Highlight */}
      <section className="px-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setActiveTab('process')}
          className="bg-mobile-green rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <p className="font-sans text-xs font-bold tracking-widest text-white/50 mb-2">OUR PROCESS</p>
          <h3 className="font-serif font-black text-4xl leading-[1.1] mb-8 text-balance">
            From orchard to ocean
          </h3>

          <div className="space-y-4 mb-8">
            {['Harvesting & selection', 'Sorting & washing', 'Extraction & processing', 'Packaging & storage'].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-serif text-sm font-bold">
                  {i + 1}
                </div>
                <span className="font-sans text-sm font-medium text-white/90">{step}</span>
              </div>
            ))}
          </div>

          <button className="bg-mobile-bg text-mobile-green px-6 py-3 rounded-full font-sans font-bold text-sm w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-white transition-colors">
            See how it works <ArrowRight size={16} />
          </button>
        </motion.div>
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

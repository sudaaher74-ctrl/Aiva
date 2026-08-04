'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProcessMobile() {
  const steps = [
    {
      title: 'Harvesting & selection',
      desc: 'Hand-picked at peak ripeness, graded on the farm for optimum brix.'
    },
    {
      title: 'Sorting & washing',
      desc: 'Multi-stage purification and optical sorting before any fruit enters the line.'
    },
    {
      title: 'Extraction & processing',
      desc: 'Aseptic, IQF and blast-freezing lines run side by side under one quality regime.'
    },
    {
      title: 'Packaging & storage',
      desc: 'Aseptic drums and frozen pouches, held in thousand-tonne cold storage until loading.'
    }
  ];

  const reasons = [
    { title: 'Farm-fresh sourcing', desc: 'Direct partnerships with growers, so every drum traces back to a named orchard.' },
    { title: 'Aseptic processing', desc: 'Sterilisation that locks in freshness without a single preservative.' },
    { title: 'Global compliance', desc: 'FSSAI, APEDA, BRC, FSSC 22000, ISO 22000 and more, audited annually.' },
    { title: 'Bulk logistics', desc: 'Drums, bag-in-box and frozen cartons, consolidated for full-container export.' }
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--c-black)] min-h-screen">
      
      {/* Hero */}
      <section className="bg-[var(--c-dark-grey)] px-6 pt-12 pb-16 text-[var(--c-white)] rounded-b-[40px] relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--c-dark)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-sans text-[10px] font-bold text-[rgba(255,255,255,0.7)] uppercase tracking-widest mb-2">
            THE AIVA STANDARD
          </p>
          <h1 className="font-serif font-black text-4xl mb-4 leading-tight">
            From orchard to ocean
          </h1>
          <p className="font-sans text-sm text-[rgba(255,255,255,0.85)] leading-relaxed mb-8">
            Four controlled stages between the tree and the container — every batch traceable back to its grower.
          </p>

          <div className="relative w-full aspect-square max-h-[300px] flex items-center justify-center">
            <img loading="lazy" decoding="async" src="/assets/images/pulp/totapurimangopulp.webp" alt="Aseptic Drum" className="w-2/3 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
          </div>
        </motion.div>
      </section>

      {/* Process Steps */}
      <section className="px-6 py-12">
        <div className="relative border-l border-[rgba(255,255,255,0.2)] ml-5 space-y-10">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative pl-8"
            >
              <div className="absolute -left-[18px] top-0 w-9 h-9 bg-[linear-gradient(90deg,#ffb800,#ff8a00)] rounded-full flex items-center justify-center text-[var(--c-black)] font-serif font-bold text-sm shadow-md ring-4 ring-[var(--c-black)]">
                {i + 1}
              </div>
              <h3 className="font-serif font-black text-xl text-[var(--c-white)] mb-2">{step.title}</h3>
              <p className="font-sans text-sm text-[var(--c-white)]/70 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why buyers stay */}
      <section className="px-6 pb-24">
        <h2 className="font-serif font-black text-3xl text-[var(--c-white)] mb-8">Why buyers stay</h2>
        
        <div className="space-y-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--c-dark)] rounded-[24px] p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--c-dark-grey)]/10 flex items-center justify-center text-[var(--c-white)] font-serif font-bold shrink-0">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[var(--c-white)] text-sm mb-1">{reason.title}</h4>
                  <p className="font-sans text-[13px] text-[var(--c-white)]/60 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

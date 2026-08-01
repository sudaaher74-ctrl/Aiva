'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutMobile() {
  const certifications = [
    'FSSAI', 'APEDA', 'BRC', 'FSSC 22000',
    'ISO 22000', 'ISO 14001', 'GLOBALG.A.P.',
    'Halal', 'Kosher', 'SGF', 'AQA'
  ];

  const points = [
    '70 MT/day aseptic processing capacity',
    'IQF & blast-freezing technology driven solutions',
    'Bulk supply & industrial packaging',
    'Custom product specifications on request'
  ];

  return (
    <div className="flex flex-col w-full pb-12">
      
      {/* Intro */}
      <section className="bg-[var(--c-black)] px-6 pt-12 pb-12 rounded-b-[40px] shadow-sm relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-sans text-[10px] font-bold text-[var(--c-mango)] uppercase tracking-widest mb-2">
            PREMIUM AGRO INGREDIENTS
          </p>
          <h1 className="font-serif font-black text-4xl text-[var(--c-white)] mb-4 leading-tight">
            Cultivating global quality standards
          </h1>
          <p className="font-sans text-sm text-[var(--c-white)]/70 leading-relaxed mb-8">
            AIVA Enterprises specialises in aseptic fruit pulps, purées and concentrates, alongside IQF and blast-frozen fruits and vegetables — reliable ingredient supply that holds its quality from source to shipment.
          </p>

          <div className="space-y-3 mb-8">
            {points.map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--c-dark)] rounded-full px-5 py-3 flex items-center gap-3 shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[linear-gradient(90deg,#ffb800,#ff8a00)] shrink-0" />
                <span className="font-sans text-[13px] font-medium text-[var(--c-white)]">{point}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-[var(--c-dark)] rounded-[24px] p-6 text-center shadow-sm relative overflow-hidden">
             <p className="font-sans text-[10px] font-bold text-[var(--c-white)]/50 uppercase tracking-widest mb-1">
               GLOBAL REACH
             </p>
             <h3 className="font-serif font-black text-2xl text-[var(--c-white)] mb-6">Shipping from Navi Mumbai</h3>
             <div className="w-24 h-24 mx-auto rounded-full border border-[var(--c-mango)]/20 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border border-[var(--c-mango)]/40 scale-75" />
               <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#ffb800,#ff8a00)]/10 scale-50" />
               <div className="w-12 h-12 bg-[linear-gradient(90deg,#ffb800,#ff8a00)] rounded-full flex items-center justify-center text-[var(--c-black)] font-sans font-bold text-[10px] z-10 shadow-lg">
                 INDIA
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Our Story / Founder */}
      <section className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--c-dark)] rounded-[32px] p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-dark)] rounded-bl-[100px] -z-10 opacity-50"></div>
          
          <p className="font-sans text-[10px] font-bold text-[var(--c-mango)] uppercase tracking-widest mb-3">
            OUR STORY
          </p>
          <h2 className="font-serif font-black text-2xl text-[var(--c-white)] mb-6 leading-tight">
            From a food technologist's vision to a global partner.
          </h2>
          
          <div className="flex items-center gap-4 mb-6 bg-[var(--c-dark-grey)] p-4 rounded-2xl">
            <div className="w-12 h-12 bg-[var(--c-mango)] rounded-full flex items-center justify-center text-[var(--c-black)] font-serif font-black text-lg shrink-0 shadow-md">
              AI
            </div>
            <div>
              <h4 className="font-sans font-bold text-[15px] text-[var(--c-white)]">Aishwarya Ingale</h4>
              <p className="font-sans text-[11px] font-bold text-[var(--c-white)]/60 uppercase tracking-wider">Founder</p>
            </div>
          </div>

          <p className="font-sans text-sm text-[var(--c-white)]/60 leading-relaxed mb-6 font-medium">
            AIVA Enterprises was founded by Aishwarya Ingale, whose journey began with a Bachelor's degree in Food Technology in India and later took her to the United States to pursue a Master's in Entrepreneurial Leadership at Babson College. During her time abroad, she gained a global perspective on food quality, sourcing, and consumer expectations.
          </p>

          <blockquote className="border-l-2 border-[var(--c-mango)] pl-4 font-serif text-[17px] italic text-[var(--c-white)]/80 font-medium leading-relaxed">
            "To bring the finest products each region has to offer to the world while proudly showcasing India's exceptional agricultural capabilities."
          </blockquote>
        </motion.div>
      </section>

      {/* Certifications */}
      <section className="px-6 py-12">
        <h2 className="font-serif font-black text-3xl text-[var(--c-white)] mb-6">Certifications</h2>
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--c-dark)] rounded-full px-4 py-2 font-sans font-bold text-xs text-[var(--c-white)] shadow-sm"
            >
              {cert}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--c-dark-grey)] rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-[var(--c-white)]"
        >
          <h2 className="font-serif font-black text-3xl mb-2">Let's talk business</h2>
          <p className="font-sans text-sm text-[rgba(255,255,255,0.7)] mb-6 leading-relaxed">
            Sample requests, specification sheets and bulk enquiries go straight to the export desk.
          </p>

          <div className="space-y-3 mb-6">
            <div className="bg-[var(--c-dark)]/10 rounded-2xl p-4">
              <p className="font-sans text-[10px] font-bold text-[rgba(255,255,255,0.7)] uppercase tracking-widest mb-1">EMAIL</p>
              <p className="font-sans text-sm font-medium">Enquire@aivaenterprises.com</p>
            </div>
            <div className="bg-[var(--c-dark)]/10 rounded-2xl p-4">
              <p className="font-sans text-[10px] font-bold text-[rgba(255,255,255,0.7)] uppercase tracking-widest mb-1">CALL / WHATSAPP</p>
              <p className="font-sans text-sm font-medium">+91 88281 77533</p>
            </div>
            <div className="bg-[var(--c-dark)]/10 rounded-2xl p-4">
              <p className="font-sans text-[10px] font-bold text-[rgba(255,255,255,0.7)] uppercase tracking-widest mb-1">HEAD OFFICE</p>
              <p className="font-sans text-sm font-medium leading-relaxed">
                Lakhani Centrium, 4th Floor, Sector 15, CBD Belapur, Navi Mumbai 400614
              </p>
            </div>
          </div>

          <button className="w-full bg-[var(--c-mango)] text-[var(--c-black)] py-4 rounded-full font-sans font-bold text-sm shadow-[0_4px_15px_rgba(244,163,0,0.4)] active:scale-95 transition-transform">
            Request a sample
          </button>
        </motion.div>
      </section>

    </div>
  );
}

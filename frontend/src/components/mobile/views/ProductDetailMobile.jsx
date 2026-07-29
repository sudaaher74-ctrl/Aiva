'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';

export default function ProductDetailMobile({ product, onBack }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      setShowContactForm(false);
    }, 3000);
  };

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

          {/* Action Buttons & Contact Form */}
          <div className="flex flex-col gap-3 mt-4">
            <AnimatePresence mode="wait">
              {!showContactForm ? (
                <motion.button 
                  key="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-[#C67139] hover:bg-[#b0612f] text-white py-4 rounded-full font-sans font-bold text-[13px] shadow-[0_4px_15px_rgba(198,113,57,0.3)] active:scale-95 transition-all"
                >
                  Talk to the export desk
                </motion.button>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-mobile-green rounded-[32px] p-6 shadow-xl text-white overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif font-black text-2xl">Contact Us</h3>
                    <button onClick={() => setShowContactForm(false)} className="text-white/60 hover:text-white bg-white/10 rounded-full p-1">
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                  
                  {isSubmitted ? (
                    <div className="bg-white/10 rounded-2xl p-6 text-center my-4">
                      <div className="w-12 h-12 bg-[#C67139] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-xl">✓</span>
                      </div>
                      <h3 className="font-serif font-black text-xl mb-2">Message Sent</h3>
                      <p className="font-sans text-[13px] text-white/70">Thank you for reaching out.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/5 text-white placeholder-white/50 px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:bg-white/15 focus:border-white/20 transition-all"
                      />
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/5 text-white placeholder-white/50 px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:bg-white/15 focus:border-white/20 transition-all"
                      />
                      <textarea 
                        name="message" 
                        placeholder="Your Message / Request" 
                        required
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/5 text-white placeholder-white/50 px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:bg-white/15 focus:border-white/20 transition-all resize-none"
                      ></textarea>
                      <div className="pt-2">
                        <button 
                          type="submit" 
                          className="w-full bg-[#C67139] text-white py-4 rounded-full font-sans font-bold text-sm shadow-[0_4px_15px_rgba(198,113,57,0.4)] active:scale-95 transition-transform"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </motion.div>
      </div>
    </motion.div>
  );
}

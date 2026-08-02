'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactMobile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 5000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-12 pb-8 px-6 bg-[var(--c-black)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-sans text-[10px] font-bold text-[var(--c-mango)] uppercase tracking-widest mb-2">
          GET IN TOUCH
        </p>
        <h1 className="font-serif font-black text-5xl text-[var(--c-white)] mb-8">Contact</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--c-dark-grey)] rounded-[32px] p-7 shadow-xl text-[var(--c-white)] mt-4"
      >
        <h2 className="font-serif font-black text-[32px] leading-tight mb-3">Let's talk<br />business</h2>
        <p className="font-sans text-sm text-[rgba(255,255,255,0.7)] mb-8 leading-relaxed">
          Sample requests, specification sheets and bulk enquiries go straight to the export desk.
        </p>

        {isSubmitted ? (
          <div className="bg-[var(--c-dark)]/10 rounded-2xl p-6 text-center my-6">
            <div className="w-12 h-12 bg-[var(--c-mango)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-[var(--c-black)] text-xl">✓</span>
            </div>
            <h3 className="font-serif font-black text-xl mb-2">Message Sent</h3>
            <p className="font-sans text-[13px] text-[rgba(255,255,255,0.7)]">Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mb-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] text-[var(--c-white)] placeholder:text-[var(--c-grey)] px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:border-[var(--c-mango)] transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] text-[var(--c-white)] placeholder:text-[var(--c-grey)] px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:border-[var(--c-mango)] transition-all"
            />
            <textarea
              name="message"
              placeholder="Your Message / Request"
              required
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-[var(--c-dark)]/10 border border-[rgba(255,255,255,0.06)] text-[var(--c-white)] placeholder-white/50 px-5 py-4 rounded-2xl font-sans text-[13px] outline-none focus:bg-[var(--c-dark)]/15 focus:border-[rgba(255,255,255,0.2)] transition-all resize-none"
            ></textarea>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[var(--c-mango)] text-[var(--c-black)] py-4 rounded-full font-sans font-bold text-sm shadow-[0_4px_15px_rgba(244,163,0,0.4)] active:scale-95 transition-transform"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

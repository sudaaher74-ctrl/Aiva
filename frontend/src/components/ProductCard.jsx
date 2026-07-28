import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import useTilt from '../hooks/useTilt';

const ProductCard = ({ product, handleQuoteClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { ref: tiltRef, handlers: tiltHandlers } = useTilt();

  // Check if we're on a mobile device (for tap vs hover behavior)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInteraction = () => {
    if (isMobile) {
      setIsHovered(!isHovered);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('./')) return url.substring(1);
    return url;
  };

  const imageUrl = getImageUrl(product.image || product.image_url);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="tilt-perspective" ref={tiltRef} {...tiltHandlers}>
    <motion.div
      className="premium-prod-card relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#0a0a0a] cursor-pointer group"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={handleInteraction}
      whileHover={!isMobile ? { y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' } : {}}
      animate={{
        y: 0,
        boxShadow: isHovered && !isMobile ? '0 20px 40px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 0.3 }}
      style={{
        border: isHovered ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isHovered && !isMobile ? '0 0 20px rgba(212, 175, 55, 0.15)' : 'none'
      }}
    >
      {/* Background Image with Zoom */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        data-tilt-layer
        animate={{ scale: isHovered && !isMobile ? 1.05 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <img loading="lazy"
          src={imageUrl} 
          alt={product.name} 
          className={`w-full h-full object-contain p-6 ${
            product.name?.includes('Coriander') ? 'scale-[1.15]' : ''
          }`}
        />
      </motion.div>

      {/* Overlay & Content */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 flex flex-col justify-end p-6"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col h-full justify-between"
            >
              {/* Top Section - Specs */}
              <div className="flex flex-col gap-2 mt-4">
                <motion.span variants={textVariants} className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                  {product.category}
                </motion.span>
                <motion.h3 variants={textVariants} className="text-2xl font-bold text-white leading-tight">
                  {product.name ? product.name.replace(/^IQF\s+/i, '') : ''}
                </motion.h3>
                
                <motion.p variants={textVariants} className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {product.description || product.desc}
                </motion.p>

                <div className="mt-4 space-y-1">
                  {product.shelfLife && (
                    <motion.div variants={textVariants} className="text-sm text-gray-400">
                      <span className="text-gray-500">Shelf Life:</span> {product.shelfLife}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom Section - Buttons */}
              <motion.div variants={buttonVariants} className="flex flex-col gap-3 mt-6">
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    if (isMobile) e.stopPropagation();
                    handleQuoteClick(imageUrl);
                  }}
                  className="w-full py-3 px-4 bg-[#D4AF37] text-black text-center font-semibold rounded-lg hover:bg-[#b5952f] transition-colors"
                >
                  Get Quote
                </a>
                <Link 
                  href={`/products/${product._id || product.id}`}
                  onClick={(e) => isMobile && e.stopPropagation()}
                  className="w-full py-3 px-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] text-center font-semibold rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>
  );
};

export default ProductCard;

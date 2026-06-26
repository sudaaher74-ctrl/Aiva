import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation, Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const gridsRef = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === ''
            ? 'http://localhost:5001/api'
            : '/api';
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setTimeout(() => {
        gsap.utils.toArray('.premium-prod-card').forEach((card) => {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          );
        });
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [products, location.hash]);

  const handleQuoteClick = (imgSource) => {
    const inquiryImg = document.querySelector('.inquiry-img img');
    if (inquiryImg) {
      inquiryImg.src = imgSource;
      gsap.fromTo(
        inquiryImg,
        { scale: 0.9, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  };

  const getVisibleCategory = () => {
    const hash = location.hash || '#aseptic';
    if (hash === '#iqf-fruits') return 'iqf-fruits';
    if (hash === '#iqf-frozen') return 'iqf-frozen';
    if (hash === '#vegetables') return 'vegetables';
    return 'aseptic';
  };

  const visibleCategory = getVisibleCategory();

  const renderGrid = (category, title) => {
    const filtered = products.filter((p) => {
      if (category === 'iqf-fruits') return p.tab === 'iqf-fruits' || p.tab === 'iqf';
      return p.tab === category;
    });
    if (visibleCategory !== category) return null;

    const getImageUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('./')) return url.substring(1);
      return url;
    };

    return (
      <section className="prod-grid-section section-padding" id={category}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title text-light">{title}</h2>
          </div>
          <div className="premium-product-grid">
            {filtered.map((product) => (
              <div className="premium-prod-card" key={product._id || product.id}>
                <div className="p-img-box">
                  <img src={getImageUrl(product.image || product.image_url)} alt={product.name} />
                </div>
                <div className="p-info">
                  <h3>{product.name}</h3>
                  <p className="p-desc">{product.description || product.desc || ''}</p>
                  <ul className="p-specs">
                    <li>
                      <span>Category:</span> {product.category}
                    </li>
                    {product.brix && (
                      <li>
                        <span>Brix:</span> {product.brix}
                      </li>
                    )}
                    {product.shelfLife && (
                      <li>
                        <span>Shelf Life:</span> {product.shelfLife}
                      </li>
                    )}
                  </ul>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <a href="#contact" className="btn-link" onClick={() => handleQuoteClick(product.image || product.image_url)}>
                      Get Quote <i className="ph ph-arrow-right"></i>
                    </a>
                    <Link to={`/products/${product._id || product.id}`} className="btn-link" style={{ color: '#D4AF37' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {renderGrid('aseptic', 'Aseptic pulp/paste')}
      {renderGrid('iqf-fruits', 'IQF fruits')}
      {renderGrid('iqf-frozen', 'Frozen')}
      {renderGrid('vegetables', 'IQF Vegetables')}
    </>
  );
}

export default ProductGrid;

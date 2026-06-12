import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

function ProductCategories() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Interactive Cards
      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card) => {
        card.addEventListener('mouseenter', (e) => {
          const color = card.getAttribute('data-color');
          gsap.to(card.querySelector('.card-bg'), {
            opacity: 1,
            background: `radial-gradient(circle at top right, ${color}33, transparent 70%)`,
            duration: 0.4,
          });
          gsap.to(card.querySelector('.product-image-wrap img'), {
            scale: 1.05,
            duration: 0.6,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', (e) => {
          gsap.to(card.querySelector('.card-bg'), {
            opacity: 0,
            duration: 0.4,
          });
          gsap.to(card.querySelector('.product-image-wrap img'), {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
      });

      // Staggered Entry
      gsap.fromTo(
        '.product-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="products section-padding dark-section" id="products" ref={sectionRef}>
      <div className="container">
        <div className="section-header text-center">
          <h4 className="section-subtitle">Our Capabilities</h4>
          <h2 className="section-title text-light">Product Categories</h2>
          <p className="section-desc text-light-dim">
            Explore our diverse range of export-quality fruit processing solutions.
          </p>
        </div>

        <div
          className="product-grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Category 1 */}
          <div className="product-card" data-color="#ffb800">
            <div className="card-bg"></div>
            <div className="product-image-wrap">
              <img src="/assets/images/products/pulp/kesarmangopulp.webp" alt="Aseptic pulp/paste" />
            </div>
            <div className="product-info">
              <h3>Aseptic pulp/paste</h3>
              <p>High-quality fruit pulps, purees, and pastes packaged under sterile conditions.</p>
              <Link to="/products#aseptic" className="btn-link">
                Explore Category
              </Link>
            </div>
          </div>

          {/* Category 2 */}
          <div className="product-card" data-color="#ff9999">
            <div className="card-bg"></div>
            <div className="product-image-wrap">
              <img src="/assets/images/products/iqf_fruites/strawberryIQF.webp" alt="IQF Products" />
            </div>
            <div className="product-info">
              <h3>IQF fruits</h3>
              <p>Individually Quick Frozen whole fruits and dices locking in pure flavor.</p>
              <Link to="/products#iqf-fruits" className="btn-link">
                Explore Category
              </Link>
            </div>
          </div>

          {/* Category 3 */}
          <div className="product-card" data-color="#99ccff">
            <div className="card-bg"></div>
            <div className="product-image-wrap">
              <img src="/assets/images/products/iqf_frozen/mint.png" alt="Frozen" />
            </div>
            <div className="product-info">
              <h3>Frozen</h3>
              <p>Premium frozen products ensuring long shelf life and consistent quality year-round.</p>
              <Link to="/products#iqf-frozen" className="btn-link">
                Explore Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCategories;

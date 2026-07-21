import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import useTilt from '../hooks/useTilt';

gsap.registerPlugin(ScrollTrigger);

function CategoryCard({ hueClass, color, image, alt, title, desc, to }) {
  const { ref, handlers } = useTilt();
  return (
    <div className="tilt-perspective">
      <div
        className={`product-card ${hueClass}`}
        data-color={color}
        ref={ref}
        {...handlers}
      >
        <div className="card-bg"></div>
        <div className="product-image-wrap" data-tilt-layer>
          <img src={image} alt={alt} />
        </div>
        <div className="product-info">
          <h3>{title}</h3>
          <p>{desc}</p>
          <Link to={to} className="btn-link">
            Explore Category
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCategories() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Interactive Cards (hover glow — theme-neutral)
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
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

      card.addEventListener('mouseleave', () => {
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
  }, { scope: sectionRef });

  return (
    <section className="products section-padding dark-section" id="products" ref={sectionRef}>
      <div className="container">
        <div className="section-header text-center">
          <h4 className="section-subtitle"></h4>
          <h2 className="section-title text-light">Product Categories</h2>
          <p className="section-desc text-light-dim">
            Explore our diverse range of high quality fruits & vegetable  processing solutions.
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
          <CategoryCard
            hueClass="card-mango"
            color="#ffb800"
            image="/assets/images/totapuriabout.png"
            alt="Aseptic pulp/paste"
            title="Aseptic pulp/paste"
            desc="High quality fruit pulp, puree, and paste packaged under sterile conditions."
            to="/products#aseptic"
          />
          <CategoryCard
            hueClass="card-strawberry"
            color="#ff9999"
            image="/assets/images/products/iqf_fruits/strawberry.png?v=2"
            alt="IQF Products"
            title="IQF"
            desc="Individually Quick Frozen fruits & vegetables and locking in real flavor."
            to="/products#iqf-fruits"
          />
          <CategoryCard
            hueClass="card-mint"
            color="#99ccff"
            image="/assets/images/products/iqf_frozen/mint.png"
            alt="Frozen"
            title="Frozen"
            desc="Premium frozen products ensuring long shelf life and consistent quality year round."
            to="/products#iqf-frozen"
          />
        </div>
      </div>
    </section>
  );
}

export default ProductCategories;

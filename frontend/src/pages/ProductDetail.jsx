import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5001/api' : '/api';
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      gsap.fromTo(
        '.pd-animate',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [product]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212', color: '#D4AF37' }}>
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212', color: '#fff', flexDirection: 'column' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Products</Link>
      </div>
    );
  }

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('./')) return '/' + url.substring(2);
    return url;
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | AIVA Enterprises</title>
        <meta name="description" content={product.description || `Premium ${product.category} for global export.`} />
      </Helmet>
      
      <section className="section-padding dark-section" style={{ paddingTop: '150px', minHeight: '100vh' }}>
        <div className="container split-layout">
          <div className="split-left">
            <div className="p-img-box pd-animate" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', height: '500px', backgroundColor: '#000' }}>
              <img 
                src={getImageUrl(product.image_url || product.image)} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
            </div>
          </div>
          <div className="split-right pd-animate">
            <h1 className="section-title text-light" style={{ fontSize: '3rem', marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '24px' }}>
              {product.category}
            </p>
            
            <p className="section-desc text-light-dim" style={{ marginBottom: '40px' }}>
              {product.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              {product.brix && (
                <div style={{ background: '#1A1A1A', padding: '20px', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
                  <p style={{ color: '#606060', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>Brix</p>
                  <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 500 }}>{product.brix}</p>
                </div>
              )}
              {product.shelfLife && (
                <div style={{ background: '#1A1A1A', padding: '20px', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
                  <p style={{ color: '#606060', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '5px' }}>Shelf Life</p>
                  <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 500 }}>{product.shelfLife}</p>
                </div>
              )}
            </div>

            <div className="pd-animate">
              <Link to={`/products#${product.tab || 'aseptic'}`} className="btn btn-outline" style={{ marginRight: '15px' }}>
                Back to Grid
              </Link>
              <a href={`/products#contact`} className="btn btn-primary">
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetail;

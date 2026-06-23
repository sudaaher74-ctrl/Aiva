import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';


const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blogs');
        const data = await res.json();
        if (data.success) {
          setBlogs(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="blog-page">
      <SEO 
        title="Industry News & Updates"
        description="Stay updated with the latest news, insights, and updates from AIVA Enterprises regarding the global export of premium agricultural commodities."
        canonicalUrl="/blog"
      />

      <section className="blog-hero" style={{ padding: '120px 20px 60px', textAlign: 'center', background: 'var(--bg-dark)' }}>
        <span className="eyebrow" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 'bold' }}>Insights & News</span>
        <h1 style={{ fontSize: '3rem', margin: '16px 0', color: 'var(--text-primary)' }}>AIVA Journal</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Discover the latest trends in global agriculture, updates from our farms, and insights into premium quality exports.
        </p>
      </section>

      <section className="blog-list" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading latest updates...</div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No articles published yet. Check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {blogs.map(blog => (
              <Link to={`/blog/${blog.slug}`} key={blog._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '220px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>No Image</div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{blog.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}></p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;

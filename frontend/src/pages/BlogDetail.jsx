import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch blog', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '120px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading article...</div>;
  }

  if (!blog) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Article Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" style={{ color: 'var(--accent-gold)', display: 'inline-block', marginTop: '24px' }}>&larr; Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <Helmet>
        <title>{blog.title} | AIVA Journal</title>
        <meta name="description" content={blog.content.substring(0, 160).replace(/<[^>]+>/g, '')} />
      </Helmet>

      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 60px' }}>
        <Link to="/blog" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 'bold' }}>&larr; Back to Journal</Link>
        
        <header style={{ marginTop: '32px', marginBottom: '40px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • By {blog.author}
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-primary)', marginBottom: '24px' }}>{blog.title}</h1>
          {blog.tags && blog.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {blog.tags.map(tag => (
                <span key={tag} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tag}</span>
              ))}
            </div>
          )}
        </header>

        {blog.image_url && (
          <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', marginBottom: '40px' }} />
        )}

        <div className="blog-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.125rem' }} dangerouslySetInnerHTML={{ __html: blog.content }}>
        </div>
      </article>

      <style>{`
        .blog-content h2, .blog-content h3 { color: var(--text-primary); margin-top: 2em; margin-bottom: 1em; }
        .blog-content a { color: var(--accent-gold); }
        .blog-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 2em 0; }
        .blog-content blockquote { border-left: 4px solid var(--accent-gold); padding-left: 1rem; margin-left: 0; font-style: italic; color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default BlogDetail;

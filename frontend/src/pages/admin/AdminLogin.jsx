import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body" style={{ background: 'var(--bg-dark)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
        <div className="panel" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign in to AIVA Admin Portal</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '12px', background: 'var(--status-danger-dim)', color: 'var(--status-danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none' }}
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

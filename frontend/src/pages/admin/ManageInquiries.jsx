import { useState, useEffect } from 'react';
import { EnvelopeOpen, Trash } from '@phosphor-icons/react';
import '../../styles/admin.css';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`${API_BASE}/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setInquiries(inquiries.filter(i => i._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete inquiry', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inquiries</h1>
          <p className="page-subtitle">Manage customer contact messages</p>
        </div>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Product / Subject</th>
                <th>Message Snippet</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No inquiries found.</td></tr>
              ) : (
                inquiries.map(inquiry => (
                  <tr key={inquiry._id}>
                    <td>
                      <div className="cell-company-info">
                        <span className="cell-company-name">{inquiry.name}</span>
                        <span className="cell-company-id">{inquiry.email}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '500' }}>{inquiry.product || 'General Inquiry'}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inquiry.message}
                    </td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="header-icon-btn" title="View"><EnvelopeOpen /></button>
                        <button className="header-icon-btn" style={{ color: 'var(--status-danger)' }} onClick={() => handleDelete(inquiry._id)} title="Delete"><Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageInquiries;

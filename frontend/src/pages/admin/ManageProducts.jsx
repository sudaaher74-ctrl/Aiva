import { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import '../../styles/admin.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary"><Plus /> Add Product</button>
        </div>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Status</th>
                <th>Shelf Life</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No products found.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="cell-company">
                        <div className="company-logo" style={{ backgroundImage: `url(${product.image_url || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--bg-panel-hover)' }}>
                          {!product.image_url && 'P'}
                        </div>
                        <div className="cell-company-info">
                          <span className="cell-company-name">{product.name}</span>
                          <span className="cell-company-id">Brix: {product.brix || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <div className={`status-badge ${product.status === 'Inactive' ? 'status-inactive' : 'status-active'}`}>
                        <div className="status-dot"></div> {product.status || 'Active'}
                      </div>
                    </td>
                    <td className="cell-value-gold">{product.shelfLife || 'N/A'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="header-icon-btn" title="Edit"><PencilSimple /></button>
                        <button className="header-icon-btn" style={{ color: 'var(--status-danger)' }} onClick={() => handleDelete(product._id)} title="Delete"><Trash /></button>
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

export default ManageProducts;

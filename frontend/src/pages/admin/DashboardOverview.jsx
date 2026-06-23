import { useState, useEffect } from 'react';
import { Package, ChatCircleDots, PresentationChart, ArrowUpRight } from '@phosphor-icons/react';
import '../../styles/admin.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({ products: 0, inquiries: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' ? 'http://localhost:5000/api' : '/api';
        const token = localStorage.getItem('adminToken');
        
        const [prodRes, inqRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/inquiries`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const prodData = prodRes.ok ? await prodRes.json() : { count: 0 };
        const inqData = inqRes.ok ? await inqRes.json() : { count: 0 };

        setStats({
          products: prodData.count || (prodData.data ? prodData.data.length : 0),
          inquiries: inqData.count || (inqData.data ? inqData.data.length : 0),
          views: 1205 // Mock data for views
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon"><PresentationChart weight="fill" /></div>
            <div className="kpi-trend trend-up"><ArrowUpRight /> 12%</div>
          </div>
          <div className="kpi-title">Total Views</div>
          <div className="kpi-value">{loading ? '-' : stats.views}</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon"><Package weight="fill" /></div>
            <div className="kpi-trend trend-up"><ArrowUpRight /> 2%</div>
          </div>
          <div className="kpi-title">Products</div>
          <div className="kpi-value">{loading ? '-' : stats.products}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon gold"><ChatCircleDots weight="fill" /></div>
            <div className="kpi-trend trend-up"><ArrowUpRight /> 5%</div>
          </div>
          <div className="kpi-title">Inquiries</div>
          <div className="kpi-value">{loading ? '-' : stats.inquiries}</div>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '16px', fontWeight: '600' }}>Recent Activity</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent activity to show.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChatCircleDots, Receipt, CurrencyDollar,
  Plus, ArrowRight, Globe,
} from '@phosphor-icons/react';
import { apiGet, formatMoney, formatDate } from '../../utils/api';
import { STATUS_STYLE } from './poConstants';
import '../../styles/admin.css';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, inquiries: 0 });
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prod, inq, poStats] = await Promise.allSettled([
          apiGet('/products'),
          apiGet('/inquiries'),
          apiGet('/purchase-orders/stats'),
        ]);

        const prodData = prod.status === 'fulfilled' ? prod.value : {};
        const inqData = inq.status === 'fulfilled' ? inq.value : {};
        setStats({
          products: prodData.count || prodData.data?.length || 0,
          inquiries: inqData.count || inqData.data?.length || 0,
        });
        if (poStats.status === 'fulfilled') setPo(poStats.value.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dash = (v) => (loading ? '—' : v);

  const kpis = [
    { icon: <Receipt weight="fill" />, label: 'Purchase Orders', value: dash(po?.total ?? 0) },
    {
      icon: <CurrencyDollar weight="fill" />, label: 'Confirmed Revenue', gold: true,
      value: dash(po ? formatMoney(po.totalRevenue, 'USD') : '$0.00'),
    },
    { icon: <Package weight="fill" />, label: 'Products', value: dash(stats.products) },
    { icon: <ChatCircleDots weight="fill" />, label: 'Inquiries', value: dash(stats.inquiries) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back, here's what's happening today.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => navigate('/admin/purchase-orders/new')}>
            <Plus /> New Purchase Order
          </button>
        </div>
      </div>

      <div className="kpi-row">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-header">
              <div className={`kpi-icon ${k.gold ? 'gold' : ''}`}>{k.icon}</div>
            </div>
            <div className="kpi-title">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="quote-layout">
        {/* Recent purchase orders */}
        <div className="panel" style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Purchase Orders</h3>
            <button className="btn btn-outline" onClick={() => navigate('/admin/purchase-orders')}>
              View all <ArrowRight />
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Buyer</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>Loading…</td></tr>
                ) : !po?.recentOrders?.length ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No purchase orders yet.</td></tr>
                ) : (
                  po.recentOrders.map((o) => {
                    const s = STATUS_STYLE[o.status] || STATUS_STYLE.Draft;
                    return (
                      <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/purchase-orders/${o._id}`)}>
                        <td style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{o.poNumber}</td>
                        <td>
                          <div className="cell-company-info">
                            <span className="cell-company-name">{o.buyerCompany}</span>
                            <span className="cell-company-id">{formatDate(o.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge" style={{ color: s.color, background: s.bg, borderColor: s.border }}>
                            <span className="status-dot" style={{ background: s.color }} />{o.status}
                          </span>
                        </td>
                        <td className="cell-value-gold" style={{ textAlign: 'right' }}>{formatMoney(o.totalAmount, o.currency)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top buyer countries */}
        <div className="panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe weight="fill" style={{ color: 'var(--accent-gold)' }} /> Top Buyer Countries
          </h3>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading…</p>
          ) : !po?.countryBreakdown?.length ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No data yet.</p>
          ) : (
            <div className="demand-list">
              {po.countryBreakdown.slice(0, 6).map((c) => (
                <div key={c._id || 'unknown'}>
                  <span className="dot gold" />
                  {c._id || 'Unknown'}
                  <strong>{formatMoney(c.value, 'USD')}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

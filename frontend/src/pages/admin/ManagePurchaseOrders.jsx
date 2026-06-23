import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, MagnifyingGlass, Eye, PencilSimple, Trash,
  FileText, Receipt, Globe, CurrencyDollar, Clock,
} from '@phosphor-icons/react';
import { apiGet, apiDelete, formatMoney, formatDate } from '../../utils/api';
import { PO_STATUSES, STATUS_STYLE } from './poConstants';
import '../../styles/admin.css';

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Draft;
  return (
    <span
      className="status-badge"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      <span className="status-dot" style={{ background: s.color }} />
      {status}
    </span>
  );
};

const ManagePurchaseOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await apiGet(`/purchase-orders?${params.toString()}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch purchase orders', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiGet('/purchase-orders/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch PO stats', err);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Debounce search + status changes
  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleDelete = async (e, order) => {
    e.stopPropagation();
    if (!window.confirm(`Delete purchase order ${order.poNumber}? This cannot be undone.`)) return;
    try {
      await apiDelete(`/purchase-orders/${order._id}`);
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
      fetchStats();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const kpis = [
    { icon: <Receipt weight="fill" />, label: 'Total Orders', value: stats?.total ?? '—' },
    { icon: <Clock weight="fill" />, label: 'Created Today', value: stats?.today ?? '—' },
    {
      icon: <CurrencyDollar weight="fill" />, label: 'Confirmed Revenue', gold: true,
      value: stats ? formatMoney(stats.totalRevenue, 'USD') : '—',
    },
    {
      icon: <Globe weight="fill" />, label: 'Buyer Countries',
      value: stats?.countryBreakdown?.length ?? '—',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Generate, track and manage export purchase orders</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => navigate('/admin/purchase-orders/new')}>
            <Plus /> New Purchase Order
          </button>
        </div>
      </div>

      {/* KPI cards */}
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

      {/* Filters */}
      <div className="panel" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="header-search" style={{ maxWidth: 360, flex: '1 1 240px' }}>
          <MagnifyingGlass />
          <input
            type="text"
            placeholder="Search PO #, buyer, company, country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="pill-tabs" style={{ flexWrap: 'wrap' }}>
          {['All', ...PO_STATUSES].map((s) => (
            <button
              key={s}
              className={`pill-tab ${statusFilter === s ? 'active-gold' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
              {s !== 'All' && stats?.statuses?.[s] != null ? ` (${stats.statuses[s]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Buyer</th>
                <th>Country</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32 }}>Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 48 }}>
                    <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <div style={{ color: 'var(--text-secondary)' }}>No purchase orders found.</div>
                    <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => navigate('/admin/purchase-orders/new')}>
                      <Plus /> Create your first PO
                    </button>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/purchase-orders/${order._id}`)}
                  >
                    <td>
                      <div className="cell-company-info">
                        <span className="cell-company-name" style={{ color: 'var(--accent-gold)' }}>{order.poNumber}</span>
                        <span className="cell-company-id">{order.items?.length || 0} item(s)</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-company-info">
                        <span className="cell-company-name">{order.buyerCompany}</span>
                        <span className="cell-company-id">{order.buyerName}</span>
                      </div>
                    </td>
                    <td>{order.buyerCountry}</td>
                    <td>{formatDate(order.poDate || order.createdAt)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td className="cell-value-gold" style={{ textAlign: 'right' }}>
                      {formatMoney(order.totalAmount, order.currency)}
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="header-icon-btn" title="View / Print" onClick={() => navigate(`/admin/purchase-orders/${order._id}`)}><Eye /></button>
                        <button className="header-icon-btn" title="Edit" onClick={() => navigate(`/admin/purchase-orders/${order._id}/edit`)}><PencilSimple /></button>
                        <button className="header-icon-btn" style={{ color: 'var(--status-danger)' }} title="Delete" onClick={(e) => handleDelete(e, order)}><Trash /></button>
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

export default ManagePurchaseOrders;

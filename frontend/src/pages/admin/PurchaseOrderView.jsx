import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Printer, PencilSimple, EnvelopeSimple, Trash, CaretDown,
} from '@phosphor-icons/react';
import { apiGet, apiPatch, apiDelete, apiPost, formatMoney, formatDate } from '../../utils/api';
import { PO_STATUSES, STATUS_STYLE } from './poConstants';
import '../../styles/admin.css';
import '../../styles/po.css';

const COMPANY = {
  name: 'AIVA ENTERPRISES',
  tagline: 'Global Export & Trade',
  address: 'Mumbai, Maharashtra, India',
  email: 'exports@aivaenterprises.com',
  phone: '+91 00000 00000',
};

const PurchaseOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const load = async () => {
    try {
      const res = await apiGet(`/purchase-orders/${id}`);
      setPo(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [id]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const changeStatus = async (status) => {
    setStatusOpen(false);
    setBusy(true);
    try {
      const res = await apiPatch(`/purchase-orders/${id}/status`, { status });
      setPo(res.data);
      flash(`Status updated to ${status}`);
    } catch (err) {
      flash(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const emailPO = async () => {
    if (!window.confirm(`Email this purchase order to ${po.buyerEmail}?`)) return;
    setBusy(true);
    try {
      const res = await apiPost(`/purchase-orders/${id}/email`, {});
      flash(res.message || 'Email queued');
    } catch (err) {
      flash(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${po.poNumber}? This cannot be undone.`)) return;
    try {
      await apiDelete(`/purchase-orders/${id}`);
      navigate('/admin/purchase-orders');
    } catch (err) {
      flash(`Error: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>;
  if (error) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--status-danger)' }}>{error}</div>;
  if (!po) return null;

  const cur = po.currency || 'USD';
  const sStyle = STATUS_STYLE[po.status] || STATUS_STYLE.Draft;

  return (
    <div>
      {/* Toolbar (hidden when printing) */}
      <div className="po-toolbar">
        <button className="btn btn-outline" onClick={() => navigate('/admin/purchase-orders')}>
          <ArrowLeft /> Back
        </button>
        <div className="po-toolbar-actions">
          <div style={{ position: 'relative' }}>
            <button className="btn btn-dark" disabled={busy} onClick={() => setStatusOpen((o) => !o)}>
              Status: {po.status} <CaretDown />
            </button>
            {statusOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 20, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 6, minWidth: 160, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                {PO_STATUSES.map((s) => (
                  <button
                    key={s}
                    className="sidebar-link"
                    style={{ width: '100%', justifyContent: 'flex-start', color: s === po.status ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
                    onClick={() => changeStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-dark" onClick={() => navigate(`/admin/purchase-orders/${id}/edit`)}><PencilSimple /> Edit</button>
          <button className="btn btn-dark" disabled={busy} onClick={emailPO}><EnvelopeSimple /> Email Buyer</button>
          <button className="btn btn-dark" style={{ color: 'var(--status-danger)' }} onClick={remove}><Trash /> Delete</button>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer /> Print / PDF</button>
        </div>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: '10px 16px', background: 'var(--accent-gold-dim)', color: 'var(--accent-gold)', borderRadius: 6, fontSize: '0.875rem', textAlign: 'center' }}>
          {toast}
        </div>
      )}

      {/* ---------------- Printable document ---------------- */}
      <div className="po-document">
        <div className="po-doc-head">
          <div>
            <div className="po-brand-name">{COMPANY.name}</div>
            <div className="po-brand-tag">{COMPANY.tagline}</div>
            <div className="po-brand-contact">
              {COMPANY.address}<br />
              {COMPANY.email} · {COMPANY.phone}
            </div>
          </div>
          <div className="po-doc-title">
            <h2>PURCHASE ORDER</h2>
            <div className="po-num">{po.poNumber}</div>
            <div className="po-meta">
              Date: {formatDate(po.poDate || po.createdAt)}<br />
              {po.deliveryDate && <>Delivery: {formatDate(po.deliveryDate)}<br /></>}
            </div>
            <span className="po-pill" style={{ color: sStyle.color }}>{po.status}</span>
          </div>
        </div>

        <div className="po-parties">
          <div>
            <div className="po-block-label">Buyer</div>
            <div className="po-block-body">
              <strong>{po.buyerCompany}</strong><br />
              {po.buyerName}<br />
              {po.buyerAddress && <>{po.buyerAddress}<br /></>}
              {po.buyerCountry}<br />
              {po.buyerEmail}<br />
              {po.buyerPhone}
            </div>
          </div>
          <div>
            <div className="po-block-label">Shipment</div>
            <div className="po-block-body">
              <strong>Incoterms:</strong> {po.incoterms}<br />
              <strong>Method:</strong> {po.shipmentMethod}<br />
              <strong>Container:</strong> {po.containerType}<br />
              <strong>Port of Loading:</strong> {po.portOfLoading}<br />
              <strong>Destination:</strong> {po.destinationPort || '—'}
            </div>
          </div>
        </div>

        <table className="po-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th>Product / Specification</th>
              <th className="num">Qty</th>
              <th className="num">Unit Price</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((it, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <strong>{it.productName}</strong>
                  {(it.packaging || it.storageCondition || it.shelfLife) && (
                    <span className="po-item-sub">
                      {[it.packaging && `Pkg: ${it.packaging}`, it.storageCondition && `Storage: ${it.storageCondition}`, it.shelfLife && `Shelf life: ${it.shelfLife}`].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </td>
                <td className="num">{it.quantity} {it.unit}</td>
                <td className="num">{formatMoney(it.unitPrice, cur)}</td>
                <td className="num">{formatMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="po-totals">
          <div className="po-totals-box">
            <div className="po-totals-row"><span>Subtotal</span><span>{formatMoney(po.subtotal, cur)}</span></div>
            {po.gstPercent > 0 && (
              <div className="po-totals-row"><span>GST / Tax ({po.gstPercent}%)</span><span>{formatMoney(po.gstAmount, cur)}</span></div>
            )}
            {po.freightCharges > 0 && (
              <div className="po-totals-row"><span>Freight</span><span>{formatMoney(po.freightCharges, cur)}</span></div>
            )}
            {po.insurance > 0 && (
              <div className="po-totals-row"><span>Insurance</span><span>{formatMoney(po.insurance, cur)}</span></div>
            )}
            <div className="po-totals-row grand"><span>Grand Total</span><span>{formatMoney(po.totalAmount, cur)}</span></div>
          </div>
        </div>

        {po.termsAndConditions && (
          <div className="po-terms">
            <div className="po-block-label">Terms &amp; Conditions</div>
            <pre>{po.termsAndConditions}</pre>
          </div>
        )}

        <div className="po-signoff">
          <div className="po-sign-line">Authorised Signatory — {COMPANY.name}</div>
          <div className="po-sign-line">Accepted by — {po.buyerCompany}</div>
        </div>

        <div className="po-foot">
          This is a computer-generated purchase order issued by {COMPANY.name}. {COMPANY.email}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderView;

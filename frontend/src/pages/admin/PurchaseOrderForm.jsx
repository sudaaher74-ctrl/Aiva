import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, FloppyDisk, Plus, Trash, User, Package,
  Boat, Calculator, NotePencil, CheckCircle,
} from '@phosphor-icons/react';
import { apiGet, apiPost, apiPatch, formatMoney } from '../../utils/api';
import {
  PO_STATUSES, UNITS, CURRENCIES, INCOTERMS, CONTAINER_TYPES, SHIPMENT_METHODS,
} from './poConstants';
import '../../styles/admin.css';

const emptyItem = () => ({
  productName: '', quantity: 1, unit: 'MT', packaging: '',
  unitPrice: 0, currency: 'USD', storageCondition: '', shelfLife: '',
});

const DEFAULT_TERMS = `1. Payment: 30% advance, 70% against Bill of Lading.
2. Quality: As per mutually agreed specifications and samples.
3. Validity: This Purchase Order is valid for 30 days from the date of issue.
4. Inspection: Goods subject to inspection at the port of loading.
5. Packaging: Export-grade packaging as per international standards.
6. Documents: Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, Phytosanitary Certificate.
7. Force Majeure: Neither party shall be liable for delays due to force majeure events.
8. Jurisdiction: Any disputes shall be subject to the jurisdiction of Indian courts.`;

const blankForm = () => ({
  poNumber: '',
  poDate: new Date().toISOString().slice(0, 10),
  status: 'Draft',
  buyerName: '', buyerCompany: '', buyerCountry: '', buyerAddress: '',
  buyerEmail: '', buyerPhone: '',
  items: [emptyItem()],
  portOfLoading: 'Nhava Sheva, India',
  destinationPort: '', incoterms: 'FOB', containerType: '20ft Dry',
  shipmentMethod: 'Sea', deliveryDate: '',
  gstPercent: 0, freightCharges: 0, insurance: 0, currency: 'USD',
  termsAndConditions: DEFAULT_TERMS, internalNotes: '',
});

const SectionHeader = ({ n, icon, title }) => (
  <div className="form-section-header">
    <div className="step-number">{n}</div>
    {icon}
    <div className="form-section-title">{title}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(blankForm());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load existing PO (edit) or next PO number (create)
  useEffect(() => {
    (async () => {
      try {
        if (isEdit) {
          const res = await apiGet(`/purchase-orders/${id}`);
          const po = res.data;
          setForm({
            ...blankForm(),
            ...po,
            poDate: po.poDate ? po.poDate.slice(0, 10) : '',
            deliveryDate: po.deliveryDate ? po.deliveryDate.slice(0, 10) : '',
            items: po.items?.length ? po.items.map((i) => ({ ...emptyItem(), ...i })) : [emptyItem()],
          });
        } else {
          const res = await apiGet('/purchase-orders/next-number');
          setForm((f) => ({ ...f, poNumber: res.data.poNumber }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateItem = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, emptyItem()] }));
  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  // ---- Live totals (mirror backend pre-save logic) ----
  const totals = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0,
    );
    const gstAmount = (subtotal * (Number(form.gstPercent) || 0)) / 100;
    const total = subtotal + gstAmount + (Number(form.freightCharges) || 0) + (Number(form.insurance) || 0);
    return { subtotal, gstAmount, total };
  }, [form.items, form.gstPercent, form.freightCharges, form.insurance]);

  const buildPayload = useCallback(() => ({
    ...form,
    poDate: form.poDate || undefined,
    deliveryDate: form.deliveryDate || undefined,
    gstPercent: Number(form.gstPercent) || 0,
    freightCharges: Number(form.freightCharges) || 0,
    insurance: Number(form.insurance) || 0,
    items: form.items.map((it) => ({
      ...it,
      quantity: Number(it.quantity) || 0,
      unitPrice: Number(it.unitPrice) || 0,
    })),
  }), [form]);

  const validate = () => {
    if (!form.buyerName.trim()) return 'Buyer name is required';
    if (!form.buyerCompany.trim()) return 'Buyer company is required';
    if (!form.buyerCountry.trim()) return 'Buyer country is required';
    if (!form.buyerEmail.trim()) return 'Buyer email is required';
    if (!form.items.length || form.items.some((i) => !i.productName.trim()))
      return 'Each line item needs a product name';
    return '';
  };

  const save = async (statusOverride) => {
    const msg = validate();
    if (msg) { setError(msg); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setError('');
    setSaving(true);
    try {
      const payload = buildPayload();
      if (statusOverride) payload.status = statusOverride;
      let res;
      if (isEdit) {
        res = await apiPatch(`/purchase-orders/${id}`, payload);
      } else {
        res = await apiPost('/purchase-orders', payload);
      }
      navigate(`/admin/purchase-orders/${res.data._id}`);
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-outline" style={{ marginBottom: 12 }} onClick={() => navigate('/admin/purchase-orders')}>
            <ArrowLeft /> Back to Orders
          </button>
          <h1 className="page-title">{isEdit ? `Edit ${form.poNumber}` : 'New Purchase Order'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update purchase order details' : 'Generate a professional export purchase order'}</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--status-danger-dim)', color: 'var(--status-danger)', borderRadius: 6, marginBottom: 20, fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="quote-layout">
        {/* ---------------- LEFT: form sections ---------------- */}
        <div>
          {/* 1. PO Details */}
          <div className="form-section">
            <SectionHeader n="1" icon={<NotePencil />} title="Order Details" />
            <div className="form-grid">
              <Field label="PO Number">
                <input className="form-input" value={form.poNumber} readOnly style={{ color: 'var(--accent-gold)', fontWeight: 600 }} />
              </Field>
              <Field label="PO Date">
                <input type="date" className="form-input" value={form.poDate} onChange={(e) => update('poDate', e.target.value)} />
              </Field>
              <Field label="Status">
                <select className="form-select" value={form.status} onChange={(e) => update('status', e.target.value)}>
                  {PO_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Base Currency">
                <select className="form-select" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* 2. Buyer */}
          <div className="form-section">
            <SectionHeader n="2" icon={<User />} title="Buyer Information" />
            <div className="form-grid">
              <Field label="Contact Name *">
                <input className="form-input" value={form.buyerName} onChange={(e) => update('buyerName', e.target.value)} placeholder="John Smith" />
              </Field>
              <Field label="Company *">
                <input className="form-input" value={form.buyerCompany} onChange={(e) => update('buyerCompany', e.target.value)} placeholder="Global Imports Ltd." />
              </Field>
              <Field label="Country *">
                <input className="form-input" value={form.buyerCountry} onChange={(e) => update('buyerCountry', e.target.value)} placeholder="United Arab Emirates" />
              </Field>
              <Field label="Email *">
                <input type="email" className="form-input" value={form.buyerEmail} onChange={(e) => update('buyerEmail', e.target.value)} placeholder="buyer@company.com" />
              </Field>
              <Field label="Phone">
                <input className="form-input" value={form.buyerPhone} onChange={(e) => update('buyerPhone', e.target.value)} placeholder="+971 50 123 4567" />
              </Field>
              <Field label="Address">
                <input className="form-input" value={form.buyerAddress} onChange={(e) => update('buyerAddress', e.target.value)} placeholder="Street, City, Postal Code" />
              </Field>
            </div>
          </div>

          {/* 3. Line Items */}
          <div className="form-section">
            <SectionHeader n="3" icon={<Package />} title="Line Items" />
            {form.items.map((item, idx) => (
              <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, marginBottom: 16, background: 'var(--bg-input)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item {idx + 1}</span>
                  {form.items.length > 1 && (
                    <button className="header-icon-btn" style={{ color: 'var(--status-danger)' }} title="Remove item" onClick={() => removeItem(idx)}><Trash /></button>
                  )}
                </div>
                <div className="form-grid">
                  <Field label="Product Name *">
                    <input className="form-input" value={item.productName} onChange={(e) => updateItem(idx, 'productName', e.target.value)} placeholder="e.g. Turmeric Powder" />
                  </Field>
                  <Field label="Packaging">
                    <input className="form-input" value={item.packaging} onChange={(e) => updateItem(idx, 'packaging', e.target.value)} placeholder="e.g. 25kg PP bags" />
                  </Field>
                  <Field label="Quantity">
                    <input type="number" min="0" step="any" className="form-input" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} />
                  </Field>
                  <Field label="Unit">
                    <select className="form-select" value={item.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)}>
                      {UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </Field>
                  <Field label="Unit Price">
                    <input type="number" min="0" step="any" className="form-input" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)} />
                  </Field>
                  <Field label="Line Amount">
                    <input className="form-input" readOnly value={formatMoney((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), form.currency)} style={{ color: 'var(--accent-gold)', fontWeight: 600 }} />
                  </Field>
                  <Field label="Storage Condition">
                    <input className="form-input" value={item.storageCondition} onChange={(e) => updateItem(idx, 'storageCondition', e.target.value)} placeholder="e.g. Cool & dry" />
                  </Field>
                  <Field label="Shelf Life">
                    <input className="form-input" value={item.shelfLife} onChange={(e) => updateItem(idx, 'shelfLife', e.target.value)} placeholder="e.g. 24 months" />
                  </Field>
                </div>
              </div>
            ))}
            <button className="btn btn-dark" onClick={addItem}><Plus /> Add Line Item</button>
          </div>

          {/* 4. Shipment */}
          <div className="form-section">
            <SectionHeader n="4" icon={<Boat />} title="Shipment Details" />
            <div className="form-grid">
              <Field label="Port of Loading">
                <input className="form-input" value={form.portOfLoading} onChange={(e) => update('portOfLoading', e.target.value)} />
              </Field>
              <Field label="Destination Port">
                <input className="form-input" value={form.destinationPort} onChange={(e) => update('destinationPort', e.target.value)} placeholder="e.g. Jebel Ali, UAE" />
              </Field>
              <Field label="Incoterms">
                <select className="form-select" value={form.incoterms} onChange={(e) => update('incoterms', e.target.value)}>
                  {INCOTERMS.map((i) => <option key={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Container Type">
                <select className="form-select" value={form.containerType} onChange={(e) => update('containerType', e.target.value)}>
                  {CONTAINER_TYPES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Shipment Method">
                <select className="form-select" value={form.shipmentMethod} onChange={(e) => update('shipmentMethod', e.target.value)}>
                  {SHIPMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Expected Delivery Date">
                <input type="date" className="form-input" value={form.deliveryDate} onChange={(e) => update('deliveryDate', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* 5. Financials */}
          <div className="form-section">
            <SectionHeader n="5" icon={<Calculator />} title="Charges & Taxes" />
            <div className="form-grid">
              <Field label="GST / Tax (%)">
                <input type="number" min="0" step="any" className="form-input" value={form.gstPercent} onChange={(e) => update('gstPercent', e.target.value)} />
              </Field>
              <Field label={`Freight Charges (${form.currency})`}>
                <input type="number" min="0" step="any" className="form-input" value={form.freightCharges} onChange={(e) => update('freightCharges', e.target.value)} />
              </Field>
              <Field label={`Insurance (${form.currency})`}>
                <input type="number" min="0" step="any" className="form-input" value={form.insurance} onChange={(e) => update('insurance', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* 6. Terms & notes */}
          <div className="form-section">
            <SectionHeader n="6" icon={<NotePencil />} title="Terms & Notes" />
            <Field label="Terms & Conditions">
              <textarea className="form-input" rows={9} value={form.termsAndConditions} onChange={(e) => update('termsAndConditions', e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
            </Field>
            <div style={{ height: 16 }} />
            <Field label="Internal Notes (not shown to buyer)">
              <textarea className="form-input" rows={3} value={form.internalNotes} onChange={(e) => update('internalNotes', e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </Field>
          </div>
        </div>

        {/* ---------------- RIGHT: live summary ---------------- */}
        <div>
          <div className="summary-panel">
            <div className="summary-header">
              <span className="summary-title">Order Summary</span>
              <span className="badge-live">● Live</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Items</span>
              <span style={{ fontWeight: 600 }}>{form.items.length}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatMoney(totals.subtotal, form.currency)}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>GST / Tax ({Number(form.gstPercent) || 0}%)</span>
              <span style={{ fontWeight: 600 }}>{formatMoney(totals.gstAmount, form.currency)}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Freight</span>
              <span style={{ fontWeight: 600 }}>{formatMoney(form.freightCharges, form.currency)}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>Insurance</span>
              <span style={{ fontWeight: 600 }}>{formatMoney(form.insurance, form.currency)}</span>
            </div>

            <div className="summary-row total">
              <span className="label">Grand Total</span>
              <span className="value">{formatMoney(totals.total, form.currency)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              <button className="btn btn-primary" style={{ justifyContent: 'center', padding: 12 }} disabled={saving} onClick={() => save()}>
                <FloppyDisk /> {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Purchase Order'}
              </button>
              {(!isEdit || form.status === 'Draft') && (
                <button className="btn btn-success" style={{ justifyContent: 'center', padding: 12 }} disabled={saving} onClick={() => save('Pending')}>
                  <CheckCircle /> Save & Submit
                </button>
              )}
              <button className="btn btn-outline" style={{ justifyContent: 'center', padding: 12 }} disabled={saving} onClick={() => navigate('/admin/purchase-orders')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;

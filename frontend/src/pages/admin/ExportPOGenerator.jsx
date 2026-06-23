import { useState, useEffect } from 'react';
import { Printer, Plus, Trash } from '@phosphor-icons/react';
import '../../styles/po-export.css';

const numberToWords = (amount) => {
  if (!amount || isNaN(amount)) return '';
  const num = Math.floor(amount); // integer part
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const convert = (n) => {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += teens[n - 10] + " ";
    } else if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      if (n % 10 > 0) str += units[n % 10] + " ";
    } else if (n > 0) {
      str += units[n] + " ";
    }
    return str;
  };

  if (num === 0) return "Zero";
  
  const words = [];
  const billion = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  if (billion > 0) words.push(convert(billion) + "Billion");
  if (million > 0) words.push(convert(million) + "Million");
  if (thousand > 0) words.push(convert(thousand) + "Thousand");
  if (remainder > 0) words.push(convert(remainder));

  return words.join(" ").trim();
};

const ExportPOGenerator = () => {
  const [data, setData] = useState({
    poNumber: 'PO-2026-0001',
    poDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    refNumber: '',
    
    supplierCompany: '',
    supplierAddress: '',
    supplierCountry: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierContact: '',

    portOfLoading: 'Nhava Sheva, India',
    portOfDischarge: '',
    countryOfOrigin: 'India',
    countryOfDestination: '',
    incoterms: 'FOB',
    expectedShipmentDate: '',

    currency: 'USD',
    freightCharges: 0,
    insurance: 0,
    otherCharges: 0,
    
    paymentTerms: 'Advance 100%',
  });

  const [items, setItems] = useState([
    { hsn: '', desc: '', spec: '', qty: 1, unit: 'MT', price: 0 }
  ]);

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { hsn: '', desc: '', spec: '', qty: 1, unit: 'MT', price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, it) => acc + (Number(it.qty) * Number(it.price) || 0), 0);
  const grandTotal = subtotal + Number(data.freightCharges) + Number(data.insurance) + Number(data.otherCharges);

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="po-generator-container">
      {/* LEFT: FORM (Hidden in Print) */}
      <div className="po-generator-form">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--po-font-heading)', color: 'var(--po-primary)' }}>PO Generator</h2>
          <button className="btn btn-primary" onClick={printDocument} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--po-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <Printer /> Export PDF
          </button>
        </div>

        <div className="po-form-section">
          <h3>PO Details</h3>
          <div className="po-form-group"><label>PO Number</label><input className="po-form-control" name="poNumber" value={data.poNumber} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Date</label><input type="date" className="po-form-control" name="poDate" value={data.poDate} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Reference No.</label><input className="po-form-control" name="refNumber" value={data.refNumber} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Currency</label>
            <select className="po-form-control" name="currency" value={data.currency} onChange={handleDataChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>

        <div className="po-form-section">
          <h3>Supplier Details</h3>
          <div className="po-form-group"><label>Company Name</label><input className="po-form-control" name="supplierCompany" value={data.supplierCompany} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Address</label><input className="po-form-control" name="supplierAddress" value={data.supplierAddress} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Country</label><input className="po-form-control" name="supplierCountry" value={data.supplierCountry} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Contact Person</label><input className="po-form-control" name="supplierContact" value={data.supplierContact} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Email</label><input type="email" className="po-form-control" name="supplierEmail" value={data.supplierEmail} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Phone</label><input className="po-form-control" name="supplierPhone" value={data.supplierPhone} onChange={handleDataChange} /></div>
        </div>

        <div className="po-form-section">
          <h3>Shipping Info</h3>
          <div className="po-form-group"><label>Port of Loading</label><input className="po-form-control" name="portOfLoading" value={data.portOfLoading} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Port of Discharge</label><input className="po-form-control" name="portOfDischarge" value={data.portOfDischarge} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Incoterms</label><input className="po-form-control" name="incoterms" value={data.incoterms} onChange={handleDataChange} /></div>
        </div>

        <div className="po-form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Products</h3>
            <button onClick={addItem} style={{ background: 'none', border: 'none', color: 'var(--po-primary)', cursor: 'pointer' }}><Plus size={20} /></button>
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: '12px', border: '1px dashed var(--po-border)', marginBottom: '12px', position: 'relative' }}>
              <button onClick={() => removeItem(idx)} style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><Trash /></button>
              <div className="po-form-group"><label>Description</label><input className="po-form-control" value={item.desc} onChange={(e) => handleItemChange(idx, 'desc', e.target.value)} /></div>
              <div className="po-form-group"><label>Spec/Packaging</label><input className="po-form-control" value={item.spec} onChange={(e) => handleItemChange(idx, 'spec', e.target.value)} /></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="po-form-group" style={{ flex: 1 }}><label>Qty</label><input type="number" className="po-form-control" value={item.qty} onChange={(e) => handleItemChange(idx, 'qty', e.target.value)} /></div>
                <div className="po-form-group" style={{ flex: 1 }}><label>Price</label><input type="number" className="po-form-control" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="po-form-section">
          <h3>Charges</h3>
          <div className="po-form-group"><label>Freight</label><input type="number" className="po-form-control" name="freightCharges" value={data.freightCharges} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Insurance</label><input type="number" className="po-form-control" name="insurance" value={data.insurance} onChange={handleDataChange} /></div>
          <div className="po-form-group"><label>Payment Terms</label>
            <select className="po-form-control" name="paymentTerms" value={data.paymentTerms} onChange={handleDataChange}>
              <option value="Advance 100%">Advance 100%</option>
              <option value="30% Advance + 70% Before Shipment">30% Advance + 70% Before Shipment</option>
              <option value="Letter of Credit">Letter of Credit</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
      </div>

      {/* RIGHT: LIVE A4 PREVIEW (Printable) */}
      <div className="po-generator-preview">
        <div className="a4-document">
          {/* Header */}
          <div className="a4-header">
            <div className="a4-logo">
              <div className="a4-company-name">AIVA ENTERPRISES</div>
              <div className="a4-company-tag">Import | Export | Global Trade</div>
              <div className="a4-company-details">
                123 Business Park, Mumbai 400614, Maharashtra India<br/>
                GSTIN: 27AABCA1234Z1Z5 | IEC: 0311234567<br/>
                Email: exports@aivaenterprises.com | Web: www.aivaenterprises.com<br/>
                Phone: +91 98765 43210
              </div>
            </div>
            <div className="a4-title-section">
              <div className="a4-doc-title">PURCHASE ORDER</div>
              <div className="a4-meta-grid">
                <span className="a4-meta-label">PO Number:</span>
                <span className="a4-meta-value">{data.poNumber}</span>
                <span className="a4-meta-label">PO Date:</span>
                <span className="a4-meta-value">{data.poDate}</span>
                {data.deliveryDate && <><span className="a4-meta-label">Delivery Date:</span><span className="a4-meta-value">{data.deliveryDate}</span></>}
                {data.refNumber && <><span className="a4-meta-label">Ref Number:</span><span className="a4-meta-value">{data.refNumber}</span></>}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="a4-parties">
            <div className="a4-party-card">
              <div className="a4-party-title">Buyer Details</div>
              <div className="a4-party-details">
                <strong>AIVA ENTERPRISES</strong>
                123 Business Park<br/>
                Mumbai 400614, Maharashtra<br/>
                Country: India<br/>
                Email: exports@aivaenterprises.com<br/>
                Phone: +91 98765 43210<br/>
                Contact: Purchase Manager
              </div>
            </div>
            <div className="a4-party-card">
              <div className="a4-party-title">Supplier Details</div>
              <div className="a4-party-details">
                <strong>{data.supplierCompany || '—'}</strong>
                {data.supplierAddress || '—'}<br/>
                Country: {data.supplierCountry || '—'}<br/>
                Email: {data.supplierEmail || '—'}<br/>
                Phone: {data.supplierPhone || '—'}<br/>
                Contact: {data.supplierContact || '—'}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="a4-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Sr No</th>
                <th style={{ width: '80px' }}>HSN Code</th>
                <th>Product Description & Specification</th>
                <th className="num">Qty</th>
                <th className="num">Unit</th>
                <th className="num">Unit Price</th>
                <th className="num">Total ({data.currency})</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.hsn || '—'}</td>
                  <td>
                    <div className="a4-product-desc">{item.desc || '—'}</div>
                    <div className="a4-product-spec">{item.spec}</div>
                  </td>
                  <td className="num">{item.qty}</td>
                  <td className="num">{item.unit}</td>
                  <td className="num">{Number(item.price).toFixed(2)}</td>
                  <td className="num">{(Number(item.qty) * Number(item.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Shipping Info */}
          <div className="a4-shipping">
            <div className="a4-shipping-col">
              <span className="a4-shipping-label">Port of Loading:</span>
              <span className="a4-shipping-value">{data.portOfLoading || '—'}</span>
              <span className="a4-shipping-label">Port of Discharge:</span>
              <span className="a4-shipping-value">{data.portOfDischarge || '—'}</span>
              <span className="a4-shipping-label">Country of Origin:</span>
              <span className="a4-shipping-value">{data.countryOfOrigin || '—'}</span>
            </div>
            <div className="a4-shipping-col">
              <span className="a4-shipping-label">Destination:</span>
              <span className="a4-shipping-value">{data.countryOfDestination || '—'}</span>
              <span className="a4-shipping-label">Incoterms:</span>
              <span className="a4-shipping-value">{data.incoterms || '—'}</span>
              <span className="a4-shipping-label">Expected Shipment:</span>
              <span className="a4-shipping-value">{data.expectedShipmentDate || '—'}</span>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="a4-summary-container">
            <div>
              <div className="a4-summary-box">
                <div className="a4-summary-row">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                {Number(data.freightCharges) > 0 && (
                  <div className="a4-summary-row">
                    <span>Freight Charges</span>
                    <span>{Number(data.freightCharges).toFixed(2)}</span>
                  </div>
                )}
                {Number(data.insurance) > 0 && (
                  <div className="a4-summary-row">
                    <span>Insurance</span>
                    <span>{Number(data.insurance).toFixed(2)}</span>
                  </div>
                )}
                {Number(data.otherCharges) > 0 && (
                  <div className="a4-summary-row">
                    <span>Other Charges</span>
                    <span>{Number(data.otherCharges).toFixed(2)}</span>
                  </div>
                )}
                <div className="a4-summary-row grand">
                  <span>Grand Total ({data.currency})</span>
                  <span>{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="a4-amount-words">
                {data.currency} {numberToWords(grandTotal)} Only
              </div>
            </div>
          </div>

          {/* Checkboxes & Terms */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', breakInside: 'avoid' }}>
            <div style={{ flex: 1 }}>
              <div className="a4-terms-section">
                <div className="a4-terms-title">Payment Terms</div>
                <div className="a4-terms-content">
                  <div className="a4-checkbox-item">
                    <span className={`a4-checkbox ${data.paymentTerms === 'Advance 100%' ? 'checked' : ''}`}></span> Advance 100%
                  </div>
                  <div className="a4-checkbox-item">
                    <span className={`a4-checkbox ${data.paymentTerms === '30% Advance + 70% Before Shipment' ? 'checked' : ''}`}></span> 30% Advance + 70% Before Shipment
                  </div>
                  <div className="a4-checkbox-item">
                    <span className={`a4-checkbox ${data.paymentTerms === 'Letter of Credit' ? 'checked' : ''}`}></span> Letter of Credit
                  </div>
                  <div className="a4-checkbox-item">
                    <span className={`a4-checkbox ${data.paymentTerms === 'CAD' ? 'checked' : ''}`}></span> CAD
                  </div>
                </div>
              </div>
              <div className="a4-terms-section">
                <div className="a4-terms-title">Shipping Documents Required</div>
                <div className="a4-terms-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <div className="a4-checkbox-item"><span className="a4-checkbox checked"></span> Commercial Invoice</div>
                  <div className="a4-checkbox-item"><span className="a4-checkbox checked"></span> Packing List</div>
                  <div className="a4-checkbox-item"><span className="a4-checkbox checked"></span> Bill of Lading</div>
                  <div className="a4-checkbox-item"><span className="a4-checkbox checked"></span> Cert of Origin</div>
                  <div className="a4-checkbox-item"><span className="a4-checkbox checked"></span> Phytosanitary</div>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div className="a4-terms-section">
                <div className="a4-terms-title">Packaging Requirements</div>
                <div className="a4-terms-content">
                  <ul className="a4-terms-list">
                    <li>Export Grade Packaging</li>
                    <li>Strong Sea Worthy Packing</li>
                    <li>Palletized Shipment</li>
                  </ul>
                </div>
              </div>
              <div className="a4-terms-section">
                <div className="a4-terms-title">Quality Specifications</div>
                <div className="a4-terms-content">
                  <ul className="a4-terms-list">
                    <li>Premium Export Quality</li>
                    <li>Free From Adulteration</li>
                    <li>As Per Approved Sample</li>
                    <li>Inspection Before Dispatch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="a4-terms-section">
            <div className="a4-terms-title">Standard Terms & Conditions</div>
            <div className="a4-terms-content">
              1. Goods must exactly match approved samples.
              2. Supplier is responsible for complete quality compliance as per export standards.
              3. Any potential shipment delays must be communicated to the buyer immediately.
              4. Buyer reserves the right to conduct independent inspection before dispatch.
              5. Packaging must strictly meet international export standards.
              6. All original shipping documents must be provided before final payment release.
              7. Force majeure clause applies.
              8. Disputes subject to Arbitration. Governing law: India.
            </div>
          </div>

          {/* Signatures */}
          <div className="a4-signatures">
            <div className="a4-sign-block">
              <div className="a4-sign-title">For AIVA ENTERPRISES</div>
              <div className="a4-sign-line">
                <strong>Authorized Signatory</strong>
                Name: <br/>
                Designation: <br/>
                Company Seal
              </div>
            </div>
            <div className="a4-sign-block" style={{ textAlign: 'right' }}>
              <div className="a4-sign-title">For Supplier</div>
              <div className="a4-sign-line" style={{ textAlign: 'left' }}>
                <strong>Authorized Signatory / Accepted By</strong>
                Name: <br/>
                Date: <br/>
                Company Stamp
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExportPOGenerator;

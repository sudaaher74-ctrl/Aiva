// Shared Purchase Order option lists & status styling
export const PO_STATUSES = ['Draft', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];

export const STATUS_STYLE = {
  Draft:      { color: '#A0A0A0', bg: 'rgba(160,160,160,0.12)', border: 'rgba(160,160,160,0.3)' },
  Pending:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  Approved:   { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  Processing: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  Shipped:    { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  Delivered:  { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.3)' },
};

export const UNITS = ['MT', 'Kg', 'Cartons', 'Drums', 'Bags'];
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED'];
export const INCOTERMS = ['FOB', 'CIF', 'EXW', 'CFR', 'DDP', 'FCA', 'CPT'];
export const CONTAINER_TYPES = ['20ft Dry', '40ft Dry', '40ft HC', 'Reefer 20ft', 'Reefer 40ft'];
export const SHIPMENT_METHODS = ['Sea', 'Air', 'Road', 'Rail', 'Multimodal'];

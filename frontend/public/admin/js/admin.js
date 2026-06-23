/**
 * AIVA Enterprises — Admin Dashboard Logic
 * Connects to backend API at localhost:5001
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('aiva_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// ============================================================
// API Helper Functions
// ============================================================
async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (res.status === 401) return handleUnauthorized();
  if (!data.success) throw new Error(data.message);
  return data;
}

async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.status === 401) return handleUnauthorized();
  if (!data.success) throw new Error(data.message);
  return data;
}

async function apiPatch(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.status === 401) return handleUnauthorized();
  if (!data.success) throw new Error(data.message);
  return data;
}

async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (res.status === 401) return handleUnauthorized();
  if (!data.success) throw new Error(data.message);
  return data;
}

function handleUnauthorized() {
  localStorage.removeItem('aiva_token');
  showLoginOverlay();
  throw new Error('Unauthorized. Please log in.');
}

// Authentication Logic
async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('aiva_token', data.token);
      hideLoginOverlay();
      window.location.reload();
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Login failed', 'error');
  }
}

function logout() {
  localStorage.removeItem('aiva_token');
  window.location.reload();
}

function showLoginOverlay() {
  const overlay = document.getElementById('login-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideLoginOverlay() {
  const overlay = document.getElementById('login-overlay');
  if (overlay) overlay.style.display = 'none';
}

window.toggleAuthView = function(view) {
  document.getElementById('login-card-view').style.display = 'none';
  document.getElementById('forgot-card-view').style.display = 'none';
  document.getElementById('reset-card-view').style.display = 'none';

  if (view === 'login') document.getElementById('login-card-view').style.display = 'block';
  if (view === 'forgot') document.getElementById('forgot-card-view').style.display = 'block';
  if (view === 'reset') document.getElementById('reset-card-view').style.display = 'block';
}

let currentResetToken = null;

window.requestPasswordReset = async function(email) {
  if (!email) return showToast('Please enter an email', 'error');
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Reset link sent to your email', 'success');
      toggleAuthView('login');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Failed to request reset', 'error');
  }
}

window.submitPasswordReset = async function(password) {
  if (!password) return showToast('Please enter a new password', 'error');
  if (!currentResetToken) return showToast('Invalid reset token', 'error');
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: currentResetToken, password })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Password reset successfully! Please log in.', 'success');
      window.location.hash = '';
      toggleAuthView('login');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Failed to reset password', 'error');
  }
}

// ============================================================
// Utility Functions
// ============================================================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return formatDate(dateStr);
}

function getStatusColor(status) {
  const colors = {
    'New': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10B981', dot: '#10B981' },
    'Contacted': { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#3B82F6', dot: '#3B82F6' },
    'Quoted': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', dot: '#F59E0B' },
    'Closed': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#8B5CF6', dot: '#8B5CF6' },
    'Lost': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#EF4444', dot: '#EF4444' }
  };
  return colors[status] || colors['New'];
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatProduct(productId) {
  if (!productId) return 'General Inquiry';
  return productId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ============================================================
// DASHBOARD PAGE — Load stats & recent inquiries
// ============================================================
async function loadDashboard() {
  const statsContainer = document.getElementById('dashboard-stats');
  const tableBody = document.getElementById('dashboard-inquiries-body');
  const recentSection = document.getElementById('recent-inquiries-section');

  if (!statsContainer) return; // Not on dashboard page

  try {
    const { data: stats } = await apiGet('/inquiries/stats');

    // Update KPI cards
    document.getElementById('kpi-total').textContent = stats.total.toLocaleString();
    document.getElementById('kpi-new').textContent = stats.statuses.New;
    document.getElementById('kpi-contacted').textContent = stats.statuses.Contacted;
    document.getElementById('kpi-closed').textContent = stats.statuses.Closed;
    document.getElementById('kpi-today').textContent = stats.today;
    document.getElementById('kpi-conversion').textContent = stats.conversionRate + '%';
    document.getElementById('kpi-countries').textContent = stats.countryBreakdown.length;

    // Update conversion progress bar
    const convBar = document.getElementById('conversion-bar');
    if (convBar) convBar.style.width = stats.conversionRate + '%';

    // Render recent inquiries table
    if (tableBody && stats.recentInquiries.length > 0) {
      tableBody.innerHTML = stats.recentInquiries.map(inq => {
        const sc = getStatusColor(inq.status);
        return `
          <tr data-id="${inq._id}">
            <td>
              <div class="cell-company">
                <div class="company-logo" style="background:${sc.bg};color:${sc.text}">${getInitials(inq.name)}</div>
                <div class="cell-company-info">
                  <span class="cell-company-name">${inq.name}</span>
                  <span class="cell-company-id">${inq.company}</span>
                </div>
              </div>
            </td>
            <td style="font-size:0.875rem;">${inq.email}</td>
            <td style="font-size:0.875rem;">${inq.phone}</td>
            <td style="font-size:0.875rem;">${inq.country}</td>
            <td style="font-size:0.875rem;">${formatProduct(inq.product)}</td>
            <td>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.7rem;font-weight:700;background:${sc.bg};border:1px solid ${sc.border};color:${sc.text}">
                <span style="width:6px;height:6px;border-radius:50%;background:${sc.dot}"></span>
                ${inq.status}
              </span>
            </td>
            <td style="font-size:0.75rem;color:var(--text-secondary);">${timeAgo(inq.createdAt)}</td>
            <td>
              <div style="display:flex;gap:6px;">
                <button class="btn-action btn-view" onclick="openInquiryModal('${inq._id}')" title="View Details">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
                <button class="btn-action btn-status" onclick="cycleStatus('${inq._id}', '${inq.status}')" title="Next Status">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } else if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:40px;">No inquiries yet. Submit the contact form to see data here.</td></tr>`;
    }

    // Top countries list
    const countriesList = document.getElementById('top-countries');
    if (countriesList && stats.countryBreakdown.length > 0) {
      countriesList.innerHTML = stats.countryBreakdown.slice(0, 5).map(c => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-subtle);">
          <span style="font-size:0.875rem;">${c._id}</span>
          <span style="font-size:0.875rem;font-weight:700;color:var(--accent-gold);">${c.count}</span>
        </div>
      `).join('');
    }

  } catch (error) {
    console.error('Dashboard load error:', error);
    if (statsContainer) {
      statsContainer.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--status-danger);padding:40px;">
        ⚠️ Cannot connect to server. Make sure the backend is running on port 5001.
        <br><small style="color:var(--text-secondary)">Run: cd server && npm start</small>
      </div>`;
    }
  }
}

// ============================================================
// INQUIRIES PAGE — Full table with filters
// ============================================================
let currentFilter = 'All';
let currentSearch = '';

async function loadInquiries(status = 'All', search = '') {
  const tableBody = document.getElementById('inquiries-table-body');
  if (!tableBody) return;

  currentFilter = status;
  currentSearch = search;

  try {
    let endpoint = '/inquiries?limit=100';
    if (status !== 'All') endpoint += `&status=${status}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;

    const { data: inquiries, pagination } = await apiGet(endpoint);

    // Update count
    const countEl = document.getElementById('inquiry-count');
    if (countEl) countEl.textContent = `${pagination.total} inquiries`;

    if (inquiries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-secondary);padding:40px;">No inquiries found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = inquiries.map(inq => {
      const sc = getStatusColor(inq.status);
      return `
        <tr data-id="${inq._id}">
          <td>
            <div class="cell-company">
              <div class="company-logo" style="background:${sc.bg};color:${sc.text}">${getInitials(inq.name)}</div>
              <div class="cell-company-info">
                <span class="cell-company-name">${inq.name}</span>
                <span class="cell-company-id">${inq.company}</span>
              </div>
            </div>
          </td>
          <td>
            <div style="display:flex;flex-direction:column;">
              <span style="font-size:0.875rem;font-weight:600;">${formatProduct(inq.product)}</span>
              ${inq.quantity ? `<span style="font-size:0.75rem;color:var(--accent-gold);font-weight:600;">${inq.quantity}</span>` : ''}
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;font-size:0.875rem;">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:14px;height:14px;color:var(--text-tertiary)"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ${inq.country}
            </div>
          </td>
          <td style="color:var(--text-secondary);font-size:0.875rem;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${inq.message ? '"' + inq.message.substring(0, 30) + '..."' : '—'}</td>
          <td><span style="font-size:0.65rem;padding:2px 6px;background:#242424;color:var(--text-secondary);border-radius:4px;font-weight:700;">${inq.source.toUpperCase()}</span></td>
          <td>
            <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.7rem;font-weight:700;background:${sc.bg};border:1px solid ${sc.border};color:${sc.text}">
              <span style="width:6px;height:6px;border-radius:50%;background:${sc.dot}"></span>
              ${inq.status}
            </span>
          </td>
          <td style="font-size:0.75rem;color:var(--text-secondary);">${formatDateTime(inq.createdAt)}</td>
          <td>
            <div style="display:flex;gap:4px;">
              <button class="btn-action btn-view" onclick="openInquiryModal('${inq._id}')" title="View">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
              <button class="btn-action btn-status" onclick="showStatusMenu(event, '${inq._id}')" title="Change Status">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Update KPI counts on inquiries page
    const statsRes = await apiGet('/inquiries/stats');
    const s = statsRes.data.statuses;
    const kpiEls = {
      'kpi-inq-total': statsRes.data.total,
      'kpi-inq-new': s.New,
      'kpi-inq-pending': s.Contacted + s.Quoted,
      'kpi-inq-resolved': s.Closed
    };
    Object.entries(kpiEls).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

  } catch (error) {
    console.error('Inquiries load error:', error);
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--status-danger);padding:40px;">
      ⚠️ Cannot connect to server.<br><small style="color:var(--text-secondary)">Run: cd server && npm start</small>
    </td></tr>`;
  }
}

// ============================================================
// STATUS MANAGEMENT
// ============================================================
const STATUS_FLOW = ['New', 'Contacted', 'Quoted', 'Closed'];

window.cycleStatus = async function(id, currentStatus) {
  const idx = STATUS_FLOW.indexOf(currentStatus);
  const nextStatus = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
  if (nextStatus === currentStatus) return;

  try {
    await apiPatch(`/inquiries/${id}/status`, { status: nextStatus });
    showToast(`Status updated to ${nextStatus}`, 'success');
    // Refresh the page data
    if (document.getElementById('dashboard-stats')) loadDashboard();
    if (document.getElementById('inquiries-table-body')) loadInquiries(currentFilter, currentSearch);
  } catch (error) {
    showToast('Failed to update status: ' + error.message, 'error');
  }
};

window.updateStatus = async function(id, newStatus) {
  try {
    await apiPatch(`/inquiries/${id}/status`, { status: newStatus });
    showToast(`Status updated to ${newStatus}`, 'success');
    closeStatusMenu();
    if (document.getElementById('dashboard-stats')) loadDashboard();
    if (document.getElementById('inquiries-table-body')) loadInquiries(currentFilter, currentSearch);
  } catch (error) {
    showToast('Failed to update status: ' + error.message, 'error');
  }
};

window.deleteInquiry = async function(id) {
  if (!confirm('Are you sure you want to delete this inquiry?')) return;
  try {
    await apiDelete(`/inquiries/${id}`);
    showToast('Inquiry deleted', 'success');
    closeInquiryModal();
    if (document.getElementById('dashboard-stats')) loadDashboard();
    if (document.getElementById('inquiries-table-body')) loadInquiries(currentFilter, currentSearch);
  } catch (error) {
    showToast('Failed to delete: ' + error.message, 'error');
  }
};

window.saveNotes = async function(id) {
  const notesEl = document.getElementById('modal-notes-input');
  if (!notesEl) return;
  try {
    await apiPatch(`/inquiries/${id}/notes`, { notes: notesEl.value });
    showToast('Notes saved', 'success');
  } catch (error) {
    showToast('Failed to save notes: ' + error.message, 'error');
  }
};

window.qualifyCustomer = async function(id) {
  if (!confirm('Are you sure you want to convert this inquiry into a Customer?')) return;
  try {
    // 1. Fetch the inquiry details
    const { data: inq } = await apiGet(`/inquiries/${id}`);
    
    // 2. Map data to Customer format
    const customerData = {
      company_name: inq.company || 'Unknown Company',
      contact_person: inq.name,
      email: inq.email,
      phone: inq.phone,
      country: inq.country
    };

    // 3. Create the customer
    await apiPost('/customers', customerData);
    
    // 4. Update inquiry status to Closed (since they are now a customer)
    await apiPatch(`/inquiries/${id}/status`, { status: 'Closed' });
    
    // 5. Append notes
    const newNotes = (inq.notes ? inq.notes + '\n\n' : '') + `[System] Qualified as Customer on ${new Date().toLocaleDateString()}`;
    await apiPatch(`/inquiries/${id}/notes`, { notes: newNotes });

    showToast('Inquiry successfully qualified as a Customer!', 'success');
    closeInquiryModal();
    
    // Refresh dashboards
    if (document.getElementById('dashboard-stats')) loadDashboard();
    if (document.getElementById('inquiries-table-body')) loadInquiries(currentFilter, currentSearch);
    if (document.getElementById('customers-table-body')) loadCustomers();
  } catch (error) {
    showToast('Failed to qualify customer: ' + error.message, 'error');
  }
};

// ============================================================
// INQUIRY DETAIL MODAL
// ============================================================
window.openInquiryModal = async function(id) {
  const modal = document.getElementById('inquiry-modal');
  if (!modal) return;

  try {
    const { data: inq } = await apiGet(`/inquiries/${id}`);
    const sc = getStatusColor(inq.status);

    document.getElementById('modal-content').innerHTML = `
      <div class="modal-header">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <div class="company-logo" style="width:48px;height:48px;font-size:1.1rem;background:${sc.bg};color:${sc.text}">${getInitials(inq.name)}</div>
            <div>
              <h2 style="font-size:1.25rem;font-weight:700;margin:0;">${inq.name}</h2>
              <p style="font-size:0.875rem;color:var(--text-secondary);margin:0;">${inq.company}</p>
            </div>
          </div>
          <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;background:${sc.bg};border:1px solid ${sc.border};color:${sc.text}">
            <span style="width:6px;height:6px;border-radius:50%;background:${sc.dot}"></span>
            ${inq.status}
          </span>
        </div>
        <button class="modal-close" onclick="closeInquiryModal()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-section">
          <h4 class="modal-section-title">Contact Information</h4>
          <div class="modal-grid">
            <div class="modal-field">
              <span class="modal-field-label">Email</span>
              <span class="modal-field-value"><a href="mailto:${inq.email}" style="color:var(--accent-gold);text-decoration:none;">${inq.email}</a></span>
            </div>
            <div class="modal-field">
              <span class="modal-field-label">Phone</span>
              <span class="modal-field-value"><a href="tel:${inq.phone}" style="color:var(--accent-gold);text-decoration:none;">${inq.phone}</a></span>
            </div>
            <div class="modal-field">
              <span class="modal-field-label">Country</span>
              <span class="modal-field-value">${inq.country}</span>
            </div>
            <div class="modal-field">
              <span class="modal-field-label">Source</span>
              <span class="modal-field-value">${inq.source}</span>
            </div>
          </div>
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">Inquiry Details</h4>
          <div class="modal-grid">
            <div class="modal-field">
              <span class="modal-field-label">Product Interest</span>
              <span class="modal-field-value">${formatProduct(inq.product)}</span>
            </div>
            <div class="modal-field">
              <span class="modal-field-label">Quantity</span>
              <span class="modal-field-value">${inq.quantity || 'Not specified'}</span>
            </div>
          </div>
          ${inq.message ? `
          <div class="modal-field" style="margin-top:12px;">
            <span class="modal-field-label">Message</span>
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-top:6px;line-height:1.6;background:var(--bg-input);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">${inq.message}</p>
          </div>
          ` : ''}
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">Admin Notes</h4>
          <textarea id="modal-notes-input" class="form-input" style="width:100%;min-height:80px;resize:vertical;" placeholder="Add notes about this inquiry...">${inq.notes || ''}</textarea>
          <button class="btn btn-primary" style="margin-top:8px;border-radius:20px;" onclick="saveNotes('${inq._id}')">Save Notes</button>
        </div>

        <div class="modal-section">
          <h4 class="modal-section-title">Update Status</h4>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${['New', 'Contacted', 'Quoted', 'Closed', 'Lost'].map(s => {
              const c = getStatusColor(s);
              const isActive = s === inq.status;
              return `<button class="btn ${isActive ? '' : 'btn-outline'}" 
                style="border-radius:20px;font-size:0.75rem;${isActive ? `background:${c.bg};color:${c.text};border:1px solid ${c.border}` : ''}" 
                onclick="updateStatus('${inq._id}', '${s}')" ${isActive ? 'disabled' : ''}>${s}</button>`;
            }).join('')}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--border-subtle);">
          <span style="font-size:0.75rem;color:var(--text-tertiary);">
            ID: ${inq.inquiryId} · Submitted ${formatDateTime(inq.createdAt)}
          </span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-success" style="border-radius:20px;font-size:0.75rem;" onclick="qualifyCustomer('${inq._id}')">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M5 13l4 4L19 7"></path></svg>
              Qualify as Customer
            </button>
            <button class="btn" style="color:var(--status-danger);border-color:rgba(239,68,68,0.3);border-radius:20px;font-size:0.75rem;" onclick="deleteInquiry('${inq._id}')">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    showToast('Failed to load inquiry: ' + error.message, 'error');
  }
};

window.closeInquiryModal = function() {
  const modal = document.getElementById('inquiry-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// ============================================================
// STATUS CONTEXT MENU
// ============================================================
window.showStatusMenu = function(event, id) {
  event.stopPropagation();
  closeStatusMenu();
  
  const menu = document.createElement('div');
  menu.className = 'status-context-menu';
  menu.id = 'active-status-menu';
  
  const rect = event.currentTarget.getBoundingClientRect();
  menu.style.top = (rect.bottom + 4) + 'px';
  menu.style.left = (rect.left - 80) + 'px';

  menu.innerHTML = ['New', 'Contacted', 'Quoted', 'Closed', 'Lost'].map(s => {
    const c = getStatusColor(s);
    return `<button onclick="updateStatus('${id}', '${s}')" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;background:none;border:none;color:var(--text-primary);cursor:pointer;font-size:0.8125rem;border-radius:4px;">
      <span style="width:8px;height:8px;border-radius:50%;background:${c.dot}"></span>
      ${s}
    </button>`;
  }).join('');

  document.body.appendChild(menu);
  
  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', closeStatusMenu, { once: true });
  }, 10);
};

function closeStatusMenu() {
  const menu = document.getElementById('active-status-menu');
  if (menu) menu.remove();
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;line-height:1;">&times;</button>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// INIT — Run on page load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Check auth and hash
  const hash = window.location.hash;
  if (hash.startsWith('#reset=')) {
    currentResetToken = hash.split('=')[1];
    showLoginOverlay();
    toggleAuthView('reset');
    return;
  }

  if (!localStorage.getItem('aiva_token')) {
    showLoginOverlay();
    toggleAuthView('login');
    return;
  }
  // Highlight active sidebar link
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Dashboard page
  if (document.getElementById('dashboard-stats')) {
    loadDashboard();
  }

  // Inquiries page
  if (document.getElementById('inquiries-table-body')) {
    loadInquiries();

    // Tab filters
    document.querySelectorAll('.pill-tab[data-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pill-tab[data-filter]').forEach(t => {
          t.classList.remove('active-gold');
          t.classList.remove('active');
        });
        tab.classList.add('active-gold');
        loadInquiries(tab.dataset.filter, currentSearch);
      });
    });

    // Search
    const searchInput = document.getElementById('inquiry-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          loadInquiries(currentFilter, searchInput.value);
        }, 300);
      });
    }
  }

  // Close modal on backdrop click
  const modal = document.getElementById('inquiry-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeInquiryModal();
    });
  }
});

// ============================================================
// ROUTING LISTENER
// ============================================================
window.addEventListener('viewChanged', (e) => {
  const viewId = e.detail.viewId;
  if (viewId === 'dashboard') loadDashboard();
  else if (viewId === 'inquiries') loadInquiries(currentFilter, currentSearch);
  else if (viewId === 'customers') loadCustomers();
  else if (viewId === 'products') loadAdminProducts();
  else if (viewId === 'purchase-orders') loadPurchaseOrders();
  else if (viewId === 'analytics') loadAnalytics();
});

// ============================================================
// CUSTOMERS PAGE
// ============================================================
async function loadCustomers() {
  const tableBody = document.getElementById('customers-table-body');
  if (!tableBody) return;
  
  try {
    const { data: customers } = await apiGet('/customers');
    if (customers.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-secondary);padding:40px;">No customers found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = customers.map(c => `
      <tr data-id="${c._id}">
        <td><div style="font-weight:600;">${c.companyName}</div><div style="font-size:0.75rem;color:var(--text-secondary)">${c.contactName}</div></td>
        <td><a href="mailto:${c.email}" style="color:var(--accent-gold);">${c.email}</a></td>
        <td>${c.phone || '-'}</td>
        <td>${c.country}</td>
        <td><span style="font-size:0.75rem;padding:4px 8px;background:rgba(255,255,255,0.05);border-radius:4px;">${c.segment || 'Retail'}</span></td>
        <td>${c.totalSpent ? '$' + c.totalSpent.toLocaleString() : '$0'}</td>
        <td>
          <button class="btn btn-action" onclick="deleteCustomer('${c._id}')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Customers load error:', error);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--status-danger);">Failed to load customers</td></tr>`;
  }
}

window.deleteCustomer = async function(id) {
  if (!confirm('Delete customer?')) return;
  try {
    await apiDelete(`/customers/${id}`);
    showToast('Customer deleted', 'success');
    loadCustomers();
  } catch (err) {
    showToast('Failed to delete customer', 'error');
  }
};

// ============================================================
// PURCHASE ORDERS PAGE
// ============================================================
async function loadPurchaseOrders() {
  const tableBody = document.getElementById('po-table-body');
  if (!tableBody) return;
  
  try {
    const { data: pos } = await apiGet('/purchase-orders');
    if (pos.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-secondary);padding:40px;">No purchase orders found.</td></tr>`;
      return;
    }
    tableBody.innerHTML = pos.map(po => {
      const statusColor = po.status === 'Draft' ? 'var(--text-secondary)' : po.status === 'Sent' ? '#3B82F6' : po.status === 'Approved' ? '#10B981' : '#F59E0B';
      return `
      <tr>
        <td style="font-weight:700;color:var(--text-primary)">${po.poNumber || po._id.substring(0, 8).toUpperCase()}</td>
        <td>${formatDate(po.createdAt)}</td>
        <td>${po.vendorName || '-'}</td>
        <td style="font-weight:600">$${(po.totalAmount || 0).toLocaleString()}</td>
        <td><span style="color:${statusColor};font-weight:700;font-size:0.8rem;padding:4px 8px;background:rgba(255,255,255,0.05);border-radius:12px;">${po.status || 'Draft'}</span></td>
        <td style="display: flex; align-items: center;">
          <button class="btn btn-action" onclick="downloadPO('${po._id}')" title="Download PDF" style="margin-right: 8px;">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </button>
          <button class="btn btn-action" onclick="deletePO('${po._id}')" title="Delete PO">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      </tr>
    `}).join('');
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--status-danger);">Failed to load POs</td></tr>`;
  }
}

window.deletePO = async function(id) {
  if (!confirm('Delete purchase order?')) return;
  try {
    await apiDelete(`/purchase-orders/${id}`);
    showToast('PO deleted successfully', 'success');
    loadPurchaseOrders();
  } catch (err) {
    showToast('Failed to delete PO', 'error');
  }
};

// ============================================================
// Deterministic PO → PDF renderer.
// Captures the 800px template with html2canvas, then places it
// into an A4 page at an EXACT fitted width + fixed left margin so
// the document can never be clipped on the left or right.
// ============================================================
async function generatePOPdf(htmlString, filename) {
  const TEMPLATE_WIDTH = 800; // must match #po-pdf-template width

  // Render off-screen at the exact template width.
  const holder = document.createElement('div');
  holder.style.cssText = `position:fixed;left:-10000px;top:0;width:${TEMPLATE_WIDTH}px;background:#ffffff;`;
  holder.innerHTML = htmlString;
  document.body.appendChild(holder);
  const target = holder.firstElementChild || holder;

  try {
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: TEMPLATE_WIDTH,
      windowWidth: TEMPLATE_WIDTH,
      scrollX: 0,
      scrollY: 0,
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();   // 210
    const pageH = pdf.internal.pageSize.getHeight();  // 297
    const margin = 10;
    const imgW = pageW - margin * 2;                  // fitted width
    const imgH = (canvas.height * imgW) / canvas.width;
    const pageContentH = pageH - margin * 2;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // First page, then slice any overflow onto further pages.
    pdf.addImage(imgData, 'JPEG', margin, margin, imgW, imgH);
    let heightLeft = imgH - pageContentH;
    let offset = 0;
    while (heightLeft > 0) {
      offset += pageContentH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, margin - offset, imgW, imgH);
      heightLeft -= pageContentH;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(holder);
  }
}

window.downloadPO = async function(id) {
  try {
    showToast('Fetching PO details...', 'info');
    const { data: po } = await apiGet(`/purchase-orders/${id}`);
    
    showToast('Generating PDF...', 'info');
    const poNum = po.poNumber || po._id.substring(0,8).toUpperCase();
    const htmlString = generatePOHtmlTemplate(po, poNum);
    await generatePOPdf(htmlString, `PO-${poNum}.pdf`);
    showToast('PDF downloaded successfully', 'success');
  } catch (err) {
    showToast('Failed to download PDF', 'error');
    console.error(err);
  }
};

// ============================================================
// PRODUCTS (ADMIN CATALOG) PAGE
// ============================================================
async function loadAdminProducts() {
  const grid = document.getElementById('admin-products-grid');
  if (!grid) return;
  
  try {
    const { data: products } = await apiGet('/products');
    if (products.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">No products found in catalog.</div>';
      return;
    }
    grid.innerHTML = products.map(p => `
      <div class="product-card" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:12px;overflow:hidden;position:relative;">
        <div style="height:150px;overflow:hidden;">
          <img src="${(p.image_url || p.image || '').replace('./assets', '../assets')}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80'">
        </div>
        <div style="padding:16px;">
          <div style="font-size:0.75rem;color:var(--accent-gold);text-transform:uppercase;margin-bottom:4px;font-weight:700">${p.category}</div>
          <h3 style="font-size:1rem;margin:0 0 8px 0;font-weight:600">${p.name}</h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:16px">${p.desc || p.description}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;font-size:0.875rem">${p.brix ? 'Brix: '+p.brix : ''}</span>
            <button class="btn btn-action" style="color:var(--status-danger)" onclick="deleteAdminProduct('${p._id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--status-danger);">Failed to load products</div>';
  }
}

window.deleteAdminProduct = async function(id) {
  if (!confirm('Delete product?')) return;
  try {
    await apiDelete(`/products/${id}`);
    showToast('Product deleted', 'success');
    loadAdminProducts();
  } catch (err) {
    showToast('Failed to delete product', 'error');
  }
};

// ============================================================
// ANALYTICS PAGE (Stubs)
// ============================================================
async function loadAnalytics() {
  // Setup charts if they exist in DOM
  const ctxRevenue = document.getElementById('analyticsRevenueChart');
  if (ctxRevenue) {
    console.log('Would render charts here if Chart.js is loaded');
  }
}

// ============================================================
// PURCHASE ORDER CREATION
// ============================================================
window.savePO = async function(status, downloadPdf = false) {
  const poData = {
    buyerName: document.getElementById('buyerName')?.value || '',
    buyerCompany: document.getElementById('buyerCompany')?.value || '',
    buyerCountry: document.getElementById('buyerCountry')?.value || '',
    buyerEmail: document.getElementById('buyerEmail')?.value || '',
    buyerPhone: document.getElementById('buyerPhone')?.value || '',
    buyerAddress: document.getElementById('buyerAddress')?.value || '',
    portOfLoading: document.getElementById('portOfLoading')?.value || '',
    destinationPort: document.getElementById('destinationPort')?.value || '',
    incoterms: document.getElementById('incoterms')?.value || 'FOB',
    containerType: document.getElementById('containerType')?.value || '20ft Dry',
    shipmentMethod: document.getElementById('shipmentMethod')?.value || 'Sea',
    deliveryDate: document.getElementById('deliveryDate')?.value || null,
    currency: document.getElementById('poCurrency')?.value || 'USD',
    gstPercent: parseFloat(document.getElementById('gstPercent')?.value || 0),
    freightCharges: parseFloat(document.getElementById('freightCharges')?.value || 0),
    insurance: parseFloat(document.getElementById('insurance')?.value || 0),
    termsAndConditions: document.getElementById('termsAndConditions')?.value || '',
    internalNotes: document.getElementById('internalNotes')?.value || '',
    status: status,
    items: [],
    totalAmount: 0
  };

  // Collect line items
  document.querySelectorAll('#line-items-body tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.po-qty')?.value || 0);
    const price = parseFloat(row.querySelector('.po-price')?.value || 0);
    const desc = row.querySelector('.po-desc')?.value || 'Item';
    const unit = row.querySelector('.po-unit')?.value || 'MT';
    const packaging = row.querySelector('.po-packaging')?.value || '';
    const currency = row.querySelector('.po-curr')?.value || 'USD';
    const storageCondition = row.querySelector('.po-storage')?.value || '';
    const shelfLife = row.querySelector('.po-shelf')?.value || '';

    if (qty > 0 && price > 0) {
      poData.items.push({ 
        productName: desc, 
        quantity: qty, 
        unitPrice: price,
        unit: unit,
        packaging: packaging,
        currency: currency,
        storageCondition: storageCondition,
        shelfLife: shelfLife
      });
      poData.totalAmount += (qty * price);
    }
  });

  if (poData.items.length === 0) {
    showToast('Add at least one line item', 'error');
    return;
  }
  if (!poData.buyerName || !poData.buyerCompany || !poData.buyerEmail || !poData.buyerCountry) {
    showToast('Please fill all required buyer details', 'error');
    return;
  }

  try {
    const { data: newPo } = await apiPost('/purchase-orders', poData);
    showToast(`PO ${status} successfully!`, 'success');
    
    if (downloadPdf) {
      showToast('Generating PDF...', 'info');
      
      const htmlString = generatePOHtmlTemplate(poData, newPo.poNumber || 'DRAFT');

      try {
        await generatePOPdf(htmlString, `PO-${newPo.poNumber || 'DRAFT'}.pdf`);
        showToast('PDF downloaded successfully', 'success');
      } catch (err) {
        showToast('Failed to generate PDF', 'error');
        console.error(err);
      }
    }
    
    // Switch to PO list view
    window.location.hash = 'purchase-orders';
  } catch (err) {
    showToast('Failed to save PO: ' + err.message, 'error');
  }
};

window.updatePOPreview = function() {
  const origin = document.getElementById('portOfLoading')?.value || '-';
  const dest = document.getElementById('destinationPort')?.value || '-';
  const inco = document.getElementById('incoterms')?.value || 'FOB';
  
  if (document.getElementById('preview-origin')) document.getElementById('preview-origin').innerText = origin;
  if (document.getElementById('preview-dest')) document.getElementById('preview-dest').innerText = dest;
  if (document.getElementById('preview-inco')) document.getElementById('preview-inco').innerText = inco;

  // Buyer Preview Update
  const buyerName = document.getElementById('buyerName')?.value || '—';
  const buyerCompany = document.getElementById('buyerCompany')?.value || 'Fill buyer details';
  if (document.getElementById('preview-buyer')) document.getElementById('preview-buyer').innerText = buyerName;
  if (document.getElementById('preview-company')) document.getElementById('preview-company').innerText = buyerCompany;

  // Calculate totals
  let subtotal = 0;
  let itemCount = 0;
  document.querySelectorAll('#line-items-body tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.po-qty')?.value || 0);
    const price = parseFloat(row.querySelector('.po-price')?.value || 0);
    const total = qty * price;
    if(row.querySelector('.po-line-total')) {
      row.querySelector('.po-line-total').innerText = '$' + total.toLocaleString();
    }
    subtotal += total;
    itemCount++;
  });
  
  const gstPercent = parseFloat(document.getElementById('gstPercent')?.value || 0);
  const gstAmount = (subtotal * gstPercent) / 100;
  const freight = parseFloat(document.getElementById('freightCharges')?.value || 0);
  const insurance = parseFloat(document.getElementById('insurance')?.value || 0);
  const total = subtotal + gstAmount + freight + insurance;

  if (document.getElementById('summary-items')) document.getElementById('summary-items').innerText = itemCount;
  if (document.getElementById('summary-subtotal')) document.getElementById('summary-subtotal').innerText = '$' + subtotal.toLocaleString();
  if (document.getElementById('summary-gst')) document.getElementById('summary-gst').innerText = '$' + gstAmount.toLocaleString();
  if (document.getElementById('summary-freight')) document.getElementById('summary-freight').innerText = '$' + freight.toLocaleString();
  if (document.getElementById('summary-insurance')) document.getElementById('summary-insurance').innerText = '$' + insurance.toLocaleString();
  if (document.getElementById('summary-total')) document.getElementById('summary-total').innerText = '$' + total.toLocaleString();
};

function generatePOHtmlTemplate(po, num) {
  let subtotal = 0;
  po.items.forEach(item => subtotal += (item.quantity * item.unitPrice));
  const taxAmount = (subtotal * (po.gstPercent || 0)) / 100;
  const grandTotal = subtotal + taxAmount + (po.freightCharges || 0) + (po.insurance || 0);

  return `
<div id="po-pdf-template" style="width: 800px; max-width: 800px; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; background: white; box-sizing: border-box; overflow: hidden; word-break: break-word;">
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 2px solid #002244; padding-bottom: 12px; margin-bottom: 12px;">
    <div style="min-width: 0;">
      <div style="display: flex; align-items: center;">
        <svg width="60" height="60" viewBox="0 0 32 32" style="margin-right: 12px;">
          <rect width="32" height="32" rx="4" fill="#0B2B5E"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#B08D57">A</text>
        </svg>
        <div>
          <h1 style="margin: 0; font-size: 36px; color: #002244; line-height: 1; letter-spacing: 2px;">AIVA</h1>
          <div style="font-size: 14px; color: #002244; letter-spacing: 3px;">ENTERPRISES</div>
        </div>
      </div>
      <div style="font-size: 11px; margin-top: 8px; font-weight: bold; letter-spacing: 1px; color: #333;">IMPORT | EXPORT | GLOBAL TRADE</div>
    </div>
    <div style="text-align: right; flex-shrink: 0;">
      <h2 style="margin: 0 0 6px 0; font-size: 18px; color: #002244; white-space: nowrap;">PURCHASE ORDER</h2>
      <table style="font-size: 10px; margin-left: auto; text-align: left; border-spacing: 0;">
        <tr><td style="font-weight: bold; padding-right: 12px; padding-bottom: 2px;">PO Number</td><td>: ${num}</td></tr>
        <tr><td style="font-weight: bold; padding-right: 12px; padding-bottom: 2px;">PO Date</td><td>: ${new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</td></tr>
        <tr><td style="font-weight: bold; padding-right: 12px; padding-bottom: 2px;">Delivery Date</td><td>: ${po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'TBD'}</td></tr>
        <tr><td style="font-weight: bold; padding-right: 12px;">Reference</td><td>: AE/IMP/05-26/001</td></tr>
      </table>
    </div>
  </div>

  <!-- Parties -->
  <div style="display: flex; gap: 12px; margin-bottom: 12px;">
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #002244; color: white; padding: 4px 8px; font-size: 10px; font-weight: bold;">BUYER (AIVA ENTERPRISES)</div>
      <div style="padding: 8px; font-size: 10px; line-height: 1.5;">
        <strong>AIVA Enterprises</strong><br>
        123, Business Park,<br>
        Mumbai – 400614,<br>
        Maharashtra, India<br>
        <table style="margin-top: 6px; border-spacing: 0;">
          <tr><td style="width: 50px;">Email</td><td>: info@aivaenterprises.com</td></tr>
          <tr><td>Phone</td><td>: +91 98765 43210</td></tr>
          <tr><td>GST No.</td><td>: 27ABCDE1234F1Z5</td></tr>
          <tr><td>IEC No.</td><td>: ABCDE1234F</td></tr>
        </table>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #002244; color: white; padding: 4px 8px; font-size: 10px; font-weight: bold;">SUPPLIER</div>
      <div style="padding: 8px; font-size: 10px; line-height: 1.5;">
        <strong>${po.buyerCompany}</strong><br>
        ${po.buyerAddress ? po.buyerAddress.split(',').join('<br>') + '<br>' : ''}
        ${po.buyerCountry}<br>
        <table style="margin-top: 6px; border-spacing: 0;">
          <tr><td style="width: 50px;">Email</td><td>: ${po.buyerEmail}</td></tr>
          <tr><td>Phone</td><td>: ${po.buyerPhone || '-'}</td></tr>
        </table>
      </div>
    </div>
  </div>

  <!-- Items Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9px; text-align: center;">
    <thead>
      <tr style="background: #002244; color: white;">
        <th style="padding: 6px; border: 1px solid #ddd; width: 30px;">Sr. No.</th>
        <th style="padding: 6px; border: 1px solid #ddd; text-align: left;">Product Description</th>
        <th style="padding: 6px; border: 1px solid #ddd;">Quantity</th>
        <th style="padding: 6px; border: 1px solid #ddd;">Unit</th>
        <th style="padding: 6px; border: 1px solid #ddd;">Unit Price (${po.currency})</th>
        <th style="padding: 6px; border: 1px solid #ddd;">Total Amount (${po.currency})</th>
      </tr>
    </thead>
    <tbody>
      ${po.items.map((item, i) => `
      <tr>
        <td style="padding: 6px; border: 1px solid #ddd;">${i + 1}</td>
        <td style="padding: 6px; border: 1px solid #ddd; text-align: left;">${item.productName}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${item.quantity.toLocaleString()}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${item.unit}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${(item.quantity * item.unitPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Summary & Logistics -->
  <div style="display: flex; gap: 12px; margin-bottom: 12px;">
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #f4f6f8; padding: 4px 8px; font-size: 10px; font-weight: bold; border-bottom: 1px solid #ddd; color: #002244;">AMOUNT SUMMARY</div>
      <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
        <tr><td style="padding: 4px 8px;">Subtotal</td><td style="padding: 4px 8px; text-align: right; width: 10px;">:</td><td style="padding: 4px 8px; text-align: right; width: 90px;">${po.currency} ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
        <tr><td style="padding: 4px 8px;">Freight Charges</td><td style="padding: 4px 8px; text-align: right;">:</td><td style="padding: 4px 8px; text-align: right;">${po.currency} ${po.freightCharges.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
        <tr><td style="padding: 4px 8px;">Insurance</td><td style="padding: 4px 8px; text-align: right;">:</td><td style="padding: 4px 8px; text-align: right;">${po.currency} ${po.insurance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
        <tr><td style="padding: 4px 8px; border-bottom: 1px solid #ddd;">Other / Tax</td><td style="padding: 4px 8px; border-bottom: 1px solid #ddd; text-align: right;">:</td><td style="padding: 4px 8px; border-bottom: 1px solid #ddd; text-align: right;">${po.currency} ${taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
        <tr style="background: #e9eff5; font-weight: bold; font-size: 11px; color: #002244;">
          <td style="padding: 8px;">GRAND TOTAL</td><td style="padding: 8px; text-align: right;">:</td><td style="padding: 8px; text-align: right;">${po.currency} ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      </table>
    </div>
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 8px; font-size: 10px; line-height: 1.8;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="font-weight: bold; color: #002244; width: 100px;">Port of Loading</td><td style="width: 10px;">:</td><td>${po.portOfLoading || '-'}</td></tr>
        <tr><td style="font-weight: bold; color: #002244;">Port of Discharge</td><td>:</td><td>${po.destinationPort || '-'}</td></tr>
        <tr><td style="font-weight: bold; color: #002244;">Country of Dest.</td><td>:</td><td>${po.buyerCountry || '-'}</td></tr>
        <tr><td style="font-weight: bold; color: #002244;">Incoterms</td><td>:</td><td>${po.incoterms || '-'}</td></tr>
        <tr><td style="font-weight: bold; color: #002244;">Expected Shipment</td><td>:</td><td>${po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'TBD'}</td></tr>
      </table>
    </div>
  </div>

  <!-- Requirements & terms blocks -->
  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #002244; color: white; padding: 4px 8px; font-size: 9px; font-weight: bold;">PAYMENT TERMS</div>
      <div style="padding: 8px; font-size: 9px; line-height: 1.6;">
        <div style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" onclick="return false;" ${po.termsAndConditions.includes('100%') ? 'checked' : ''}> Advance 100%</div>
        <div style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" onclick="return false;" ${po.termsAndConditions.includes('Advance') && !po.termsAndConditions.includes('100%') ? 'checked' : ''}> 30% Adv, 70% Before Ship</div>
        <div style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" onclick="return false;" ${po.termsAndConditions.includes('LC') || po.termsAndConditions.includes('L/C') ? 'checked' : ''}> Letter of Credit (L/C)</div>
        <div style="margin-top: 6px; font-weight: bold; color: #002244;">Payment in ${po.currency}</div>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #002244; color: white; padding: 4px 8px; font-size: 9px; font-weight: bold;">PACKAGING REQ</div>
      <div style="padding: 8px; font-size: 9px; line-height: 1.6;">
        <div>${po.items[0]?.packaging || 'Standard Packaging'}</div>
        <div>Strong & Sea-worthy Packing</div>
        <div>Proper Palletization</div>
        <div>Intl Standards</div>
      </div>
    </div>
    <div style="flex: 1; border: 1px solid #ddd;">
      <div style="background: #002244; color: white; padding: 4px 8px; font-size: 9px; font-weight: bold;">QUALITY SPECS</div>
      <div style="padding: 8px; font-size: 9px; line-height: 1.6;">
        <div>Premium quality.</div>
        <div>Free from adulteration.</div>
        <div>As per buyer's sample.</div>
      </div>
    </div>
  </div>

  <!-- Special Instructions -->
  <div style="margin-bottom: 16px;">
    <div style="font-size: 10px; font-weight: bold; color: #002244; margin-bottom: 4px;">SPECIAL INSTRUCTIONS</div>
    <div style="font-size: 9px; padding: 6px 10px; background: #f9f9f9; border: 1px solid #eee;">
      Please ensure timely shipment and provide all necessary shipping documents.<br>
      ${po.termsAndConditions.replace(/\\n/g, '<br>')}
    </div>
  </div>

  <!-- Signatures -->
  <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 12px;">
    <div style="width: 200px;">
      <div style="font-weight: bold; margin-bottom: 30px; color: #002244;">For AIVA ENTERPRISES</div>
      <div style="border-top: 1px solid #111; padding-top: 4px;">Authorized Signatory</div>
      <table style="margin-top: 6px; width: 100%;">
        <tr><td>Name</td><td>: _______________</td></tr>
        <tr><td>Date</td><td>: _______________</td></tr>
      </table>
    </div>
    <div style="width: 70px; height: 70px; border: 2px solid #002244; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.6;">
      <div style="font-size: 12px; font-weight: bold; color: #002244;">AIVA</div>
      <div style="font-size: 6px; color: #002244;">ENTERPRISES</div>
    </div>
    <div style="width: 200px;">
      <div style="font-weight: bold; margin-bottom: 30px; color: #002244;">For SUPPLIER</div>
      <div style="border-top: 1px solid #111; padding-top: 4px;">Authorized Signatory</div>
      <table style="margin-top: 6px; width: 100%;">
        <tr><td>Name</td><td>: _______________</td></tr>
        <tr><td>Date</td><td>: _______________</td></tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #002244; padding-top: 8px; color: #002244;">
    <div style="font-size: 16px; font-weight: bold; font-style: italic;">Thank You!</div>
    <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px;">LET'S GROW TOGETHER GLOBALLY 🌐</div>
  </div>
</div>
  `;
}

document.addEventListener('input', (e) => {
  if (e.target.closest('#view-create-po')) {
    updatePOPreview();
  }
});

window.openAddProductModal = function() {
  let modal = document.getElementById('add-product-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-product-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width:500px;">
        <div class="modal-header">
          <h3 class="modal-title">Add New Product</h3>
          <button class="modal-close" onclick="closeAddProductModal()">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="modal-body">
          <form id="add-product-form" onsubmit="event.preventDefault(); submitAddProduct();">
            <div class="modal-row">
              <div class="modal-group full-width">
                <label class="modal-label">Product Name</label>
                <input type="text" id="prod-name" class="modal-input" required>
              </div>
              <div class="modal-group full-width">
                <label class="modal-label">Category</label>
                <input type="text" id="prod-category" class="modal-input" required>
              </div>
              <div class="modal-group full-width">
                <label class="modal-label">Description</label>
                <textarea id="prod-desc" class="modal-textarea" rows="3" required></textarea>
              </div>
              <div class="modal-group">
                <label class="modal-label">Brix</label>
                <input type="text" id="prod-brix" class="modal-input">
              </div>
              <div class="modal-group">
                <label class="modal-label">Tab ID</label>
                <select id="prod-tab" class="modal-select">
                  <option value="aseptic">Aseptic</option>
                  <option value="iqf">IQF</option>
                  <option value="concentrates">Concentrates</option>
                </select>
              </div>
              <div class="modal-group full-width">
                <button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Save Product</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('active');
};

window.closeAddProductModal = function() {
  const modal = document.getElementById('add-product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('add-product-form').reset();
  }
};

window.submitAddProduct = async function() {
  const product = {
    name: document.getElementById('prod-name').value,
    category: document.getElementById('prod-category').value,
    description: document.getElementById('prod-desc').value,
    brix: document.getElementById('prod-brix').value,
    tab: document.getElementById('prod-tab').value,
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80'
  };

  try {
    await apiPost('/products', product);
    showToast('Product added', 'success');
    closeAddProductModal();
    loadAdminProducts();
  } catch (err) {
    showToast('Failed to add product', 'error');
  }
};

window.addLineItem = function() {
  const tbody = document.getElementById('line-items-body');
  if (!tbody) return;
  const rowId = 'line-' + Math.random().toString(36).substr(2, 9);
  const row = document.createElement('tr');
  row.id = rowId;
  row.innerHTML = `
    <td>
      <select class="form-input po-desc" style="padding:6px;width:100%;font-size:0.875rem">
        <option value="Alphonso Mango Pulp">Alphonso Mango Pulp</option>
        <option value="Totapuri Mango Pulp">Totapuri Mango Pulp</option>
        <option value="Guava Pulp">Guava Pulp</option>
        <option value="IQF Sweet Corn">IQF Sweet Corn</option>
      </select>
    </td>
    <td><input type="number" class="form-input po-qty" value="1" min="1" style="padding:6px;width:100%"></td>
    <td>
      <select class="form-input po-unit" style="padding:6px;width:100%">
        <option value="MT">MT</option>
        <option value="FCL">FCL</option>
        <option value="KG">KG</option>
      </select>
    </td>
    <td><input type="text" class="form-input po-packaging" value="Aseptic Drum" style="padding:6px;width:100%"></td>
    <td><input type="number" class="form-input po-price" value="1000" min="0" style="padding:6px;width:100%"></td>
    <td>
      <select class="form-input po-curr" style="padding:6px;width:100%">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </td>
    <td><input type="text" class="form-input po-storage" value="Ambient" style="padding:6px;width:100%"></td>
    <td><input type="text" class="form-input po-shelf" value="24 Months" style="padding:6px;width:100%"></td>
    <td class="po-line-total" style="font-weight:600;padding:6px;">$1,000</td>
    <td>
      <button class="btn btn-action" onclick="document.getElementById('${rowId}').remove(); updatePOPreview();" style="color:var(--status-danger)">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="16" height="16"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    </td>
  `;
  tbody.appendChild(row);
  updatePOPreview();
};

// ============================================================
// ADD INQUIRY MODAL (Admin side)
// ============================================================
window.openAddInquiryModal = function() {
  let modal = document.getElementById('add-inquiry-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-inquiry-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width:550px;">
        <div class="modal-header">
          <h3 class="modal-title">Create New Inquiry</h3>
          <button class="modal-close" type="button" onclick="closeAddInquiryModal()">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="modal-body">
          <form id="add-inquiry-form" onsubmit="event.preventDefault(); submitAddInquiry();">
            <div class="modal-row">
              <div class="modal-group">
                <label class="modal-label">Name</label>
                <input type="text" id="inq-name" class="modal-input" required>
              </div>
              <div class="modal-group">
                <label class="modal-label">Company</label>
                <input type="text" id="inq-company" class="modal-input" required>
              </div>
              <div class="modal-group">
                <label class="modal-label">Email</label>
                <input type="email" id="inq-email" class="modal-input" required>
              </div>
              <div class="modal-group">
                <label class="modal-label">Phone</label>
                <input type="text" id="inq-phone" class="modal-input">
              </div>
              <div class="modal-group">
                <label class="modal-label">Country</label>
                <input type="text" id="inq-country" class="modal-input" required>
              </div>
              <div class="modal-group">
                <label class="modal-label">Product of Interest</label>
                <input type="text" id="inq-product" class="modal-input">
              </div>
              <div class="modal-group full-width">
                <label class="modal-label">Message/Requirements</label>
                <textarea id="inq-message" class="modal-textarea" rows="4"></textarea>
              </div>
              <div class="modal-group full-width">
                <button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Create Inquiry</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('active');
};

window.closeAddInquiryModal = function() {
  const modal = document.getElementById('add-inquiry-modal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('add-inquiry-form')?.reset();
  }
};

window.submitAddInquiry = async function() {
  const inquiry = {
    name: document.getElementById('inq-name').value,
    company: document.getElementById('inq-company').value,
    email: document.getElementById('inq-email').value,
    phone: document.getElementById('inq-phone').value,
    country: document.getElementById('inq-country').value,
    product: document.getElementById('inq-product').value,
    message: document.getElementById('inq-message').value,
    source: 'Admin Dashboard',
    status: 'New'
  };

  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (!res.ok) throw new Error('Failed to create inquiry');
    
    showToast('Inquiry created successfully!', 'success');
    closeAddInquiryModal();
    
    // Refresh the inquiries view if it's currently showing
    if (typeof loadInquiries === 'function') {
      loadInquiries(typeof currentFilter !== 'undefined' ? currentFilter : 'All', typeof currentSearch !== 'undefined' ? currentSearch : '');
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to create inquiry', 'error');
  }
};

// ============================================================
// BLOGS MANAGEMENT
// ============================================================
let quillEditor = null;

window.loadBlogs = async function() {
  const tableBody = document.getElementById('blogs-table-body');
  if (!tableBody) return;
  try {
    const res = await fetch(`${API_BASE}/blogs/admin`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_token')}` }
    });
    const data = await res.json();
    if (data.success) {
      if (data.data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="po-empty">No blogs found.</td></tr>`;
        return;
      }
      tableBody.innerHTML = data.data.map(blog => `
        <tr>
          <td><strong>${blog.title}</strong></td>
          <td>${blog.author}</td>
          <td><span class="badge ${blog.isPublished ? 'badge-passed' : 'badge-pending'}">${blog.isPublished ? 'Published' : 'Draft'}</span></td>
          <td>${new Date(blog.createdAt).toLocaleDateString()}</td>
          <td style="text-align: right;">
            <div class="po-actions" style="justify-content: flex-end;">
              <button class="po-action-btn" onclick="editBlog('${blog._id}')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
              <button class="po-action-btn danger" onclick="deleteBlog('${blog._id}')"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to load blogs', 'error');
  }
}

function initQuill() {
  if (!quillEditor && document.getElementById('blog-editor')) {
    quillEditor = new Quill('#blog-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });
  }
}

window.openBlogModal = function() {
  initQuill();
  document.getElementById('blog-id').value = '';
  document.getElementById('blog-title').value = '';
  document.getElementById('blog-slug').value = '';
  document.getElementById('blog-author').value = 'AIVA Enterprises';
  document.getElementById('blog-tags').value = '';
  document.getElementById('blog-image').value = '';
  document.getElementById('blog-published').checked = true;
  quillEditor.root.innerHTML = '';
  
  const modal = document.getElementById('blog-modal');
  if (modal) modal.classList.add('active');
}

window.closeBlogModal = function() {
  const modal = document.getElementById('blog-modal');
  if (modal) modal.classList.remove('active');
}

window.editBlog = async function(id) {
  try {
    const res = await fetch(`${API_BASE}/blogs/admin`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_token')}` }
    });
    const data = await res.json();
    const blog = data.data.find(b => b._id === id);
    if (!blog) return;

    initQuill();
    document.getElementById('blog-id').value = blog._id;
    document.getElementById('blog-title').value = blog.title;
    document.getElementById('blog-slug').value = blog.slug;
    document.getElementById('blog-author').value = blog.author;
    document.getElementById('blog-tags').value = blog.tags ? blog.tags.join(', ') : '';
    document.getElementById('blog-image').value = ''; // cannot pre-fill file inputs
    document.getElementById('blog-published').checked = blog.isPublished;
    quillEditor.root.innerHTML = blog.content;

    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.add('active');
  } catch (err) {
    showToast('Failed to load blog details', 'error');
  }
}

window.saveBlog = async function() {
  const id = document.getElementById('blog-id').value;
  const title = document.getElementById('blog-title').value;
  const slug = document.getElementById('blog-slug').value;
  const author = document.getElementById('blog-author').value;
  const tagsStr = document.getElementById('blog-tags').value;
  const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);
  const isPublished = document.getElementById('blog-published').checked;
  const content = quillEditor.root.innerHTML;
  const imageFile = document.getElementById('blog-image').files[0];

  if (!title || !slug || !content) {
    return showToast('Title, slug, and content are required', 'error');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('slug', slug);
  formData.append('author', author);
  formData.append('content', content);
  formData.append('tags', JSON.stringify(tags));
  formData.append('isPublished', isPublished);
  if (imageFile) formData.append('image', imageFile);

  try {
    const url = id ? `${API_BASE}/blogs/${id}` : `${API_BASE}/blogs`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_token')}` },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      showToast('Blog saved successfully', 'success');
      closeBlogModal();
      loadBlogs();
    } else {
      showToast(data.message || 'Error saving blog', 'error');
    }
  } catch (err) {
    showToast('Failed to save blog', 'error');
  }
}

window.deleteBlog = async function(id) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('aiva_token')}` }
    });
    if (res.ok) {
      showToast('Blog deleted', 'success');
      loadBlogs();
    }
  } catch (err) {
    showToast('Failed to delete blog', 'error');
  }
}

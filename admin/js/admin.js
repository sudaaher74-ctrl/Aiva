/**
 * AIVA Enterprises — Admin Dashboard Logic
 * Connects to backend API at localhost:5001
 */

const API_BASE = 'http://localhost:5001/api';

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
          <button class="btn" style="color:var(--status-danger);border-color:rgba(239,68,68,0.3);border-radius:20px;font-size:0.75rem;" onclick="deleteInquiry('${inq._id}')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Delete
          </button>
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
  // Check auth
  if (!localStorage.getItem('aiva_token')) {
    showLoginOverlay();
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

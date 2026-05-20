/**
 * AIVA Enterprises — Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Highlight active sidebar link
  const currentPath = window.location.pathname.split('/').pop();
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Mock initial inquiries if none exist
  if (!localStorage.getItem('aiva_inquiries')) {
    const mockInquiries = [
      { id: "INQ-9D8F7G", date: new Date().toISOString(), name: "John Smith", company: "Global Foods Ltd", email: "john@globalfoods.com", country: "UK", product: "alphonso-mango-pulp", status: "New", source: "Product Page" },
      { id: "INQ-3H4K9L", date: new Date(Date.now() - 86400000).toISOString(), name: "Maria Garcia", company: "Iberia Imports", email: "maria@iberia.es", country: "Spain", product: "tomato-paste-28-30", status: "Contacted", source: "Contact Page" },
      { id: "INQ-1A2B3C", date: new Date(Date.now() - 172800000).toISOString(), name: "Ahmed Al-Fayed", company: "Desert Oasis Bev", email: "ahmed@desertoasis.ae", country: "UAE", product: "white-guava-concentrate", status: "Closed", source: "Contact Page" }
    ];
    localStorage.setItem('aiva_inquiries', JSON.stringify(mockInquiries));
  }

  const getInquiries = () => JSON.parse(localStorage.getItem('aiva_inquiries') || '[]');
  
  // Update Dashboard KPIs
  if (document.getElementById('kpi-total-inquiries')) {
    const inquiries = getInquiries();
    document.getElementById('kpi-total-inquiries').textContent = inquiries.length;
    
    const newInquiries = inquiries.filter(i => i.status === 'New').length;
    document.getElementById('kpi-new-leads').textContent = newInquiries;
    
    const products = JSON.parse(localStorage.getItem('aiva_products') || '[]');
    document.getElementById('kpi-active-products').textContent = products.length || 10;
  }

  // Render Recent Inquiries Table
  const tableBody = document.getElementById('recent-inquiries-body');
  if (tableBody) {
    const inquiries = getInquiries().sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (inquiries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted);">No inquiries found.</td></tr>`;
    } else {
      tableBody.innerHTML = '';
      inquiries.forEach(inq => {
        const dateObj = new Date(inq.date);
        const dateStr = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        let badgeClass = 'badge-new';
        if (inq.status === 'Contacted') badgeClass = 'badge-contacted';
        if (inq.status === 'Closed') badgeClass = 'badge-closed';

        tableBody.innerHTML += `
          <tr>
            <td><strong>${inq.id}</strong></td>
            <td>${dateStr}</td>
            <td>
              <div style="font-weight: 500; color: white;">${inq.name}</div>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${inq.company}</div>
            </td>
            <td>${inq.country}</td>
            <td><span class="badge ${badgeClass}">${inq.status}</span></td>
            <td>
              <button class="btn btn-sm btn-outline" onclick="viewInquiry('${inq.id}')">View</button>
            </td>
          </tr>
        `;
      });
    }
  }

  // Handle Chart.js if on analytics page
  const ctx = document.getElementById('analyticsChart');
  if (ctx && window.Chart) {
    const inquiries = getInquiries();
    
    const statusCounts = { 'New': 0, 'Contacted': 0, 'Closed': 0 };
    inquiries.forEach(i => {
      if(statusCounts[i.status] !== undefined) statusCounts[i.status]++;
    });

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New Leads', 'Contacted', 'Closed Deals'],
        datasets: [{
          data: [statusCounts['New'], statusCounts['Contacted'], statusCounts['Closed']],
          backgroundColor: [
            '#3b82f6',
            '#f59e0b',
            '#10b981'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

});

window.viewInquiry = function(id) {
  alert('Viewing details for inquiry: ' + id + '\\n(In a full implementation, this would open a modal with inquiry details and allow status updates)');
};

import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Package, ChatCircleDots, SignOut, SquaresFour, Receipt, Printer } from '@phosphor-icons/react';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-body">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">
            <div className="sidebar-logo-icon">A</div>
            <div className="sidebar-logo-text">
              <span>AIVA</span>
              <span>Admin Portal</span>
            </div>
          </Link>
        </div>
        
        <div className="sidebar-nav">
          <div className="sidebar-nav-group">Main Menu</div>
          <Link to="/admin/dashboard" className={`sidebar-link ${path === '/admin/dashboard' || path === '/admin' ? 'active' : ''}`}>
            <SquaresFour weight={path === '/admin/dashboard' ? 'fill' : 'regular'} /> Dashboard
          </Link>
          <Link to="/admin/products" className={`sidebar-link ${path.includes('/admin/products') ? 'active' : ''}`}>
            <Package weight={path.includes('/admin/products') ? 'fill' : 'regular'} /> Products
          </Link>
          <Link to="/admin/inquiries" className={`sidebar-link ${path.includes('/admin/inquiries') ? 'active' : ''}`}>
            <ChatCircleDots weight={path.includes('/admin/inquiries') ? 'fill' : 'regular'} /> Inquiries
          </Link>

          <div className="sidebar-nav-group">Account</div>
          <a href="#" className="sidebar-link logout-link" onClick={handleLogout}>
            <SignOut /> Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <div className="header-search">
             {/* Optional search */}
          </div>
          <div className="header-actions">
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin Portal</span>
                <span className="user-role">AIVA Enterprises</span>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

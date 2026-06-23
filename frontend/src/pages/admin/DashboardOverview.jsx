import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ChatCircleDots
} from '@phosphor-icons/react';
import { apiGet } from '../../utils/api';
import '../../styles/admin.css';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prod, inq] = await Promise.allSettled([
          apiGet('/products'),
          apiGet('/inquiries'),
        ]);

        const prodData = prod.status === 'fulfilled' ? prod.value : {};
        const inqData = inq.status === 'fulfilled' ? inq.value : {};
        setStats({
          products: prodData.count || prodData.data?.length || 0,
          inquiries: inqData.count || inqData.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dash = (v) => (loading ? '—' : v);

  const kpis = [
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
      </div>

      <div className="kpi-row">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-header">
              <div className="kpi-icon">{k.icon}</div>
            </div>
            <div className="kpi-title">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;

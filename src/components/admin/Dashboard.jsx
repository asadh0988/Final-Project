// Admin Dashboard: stats cards, orders table, user details
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import StatsCard from './StatsCard';
import OrdersTable from './OrdersTable';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="stats-cards">
        <StatsCard title="Total Orders" value={stats.totalOrders} />
        <StatsCard title="Total Users" value={stats.totalUsers} />
        {stats.byStatus.map(s => (
          <StatsCard key={s.status} title={s.status} value={s.count} />
        ))}
      </div>
      <OrdersTable />
    </div>
  );
};

export default Dashboard;

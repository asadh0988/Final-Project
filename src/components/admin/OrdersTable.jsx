// OrdersTable: lists all orders with search, filter, sort, and status change
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await axios.get('/api/admin/orders', { params });
      setOrders(res.data.data.orders);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/admin/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search orders..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>{order.status}</td>
                <td>{order.details}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;

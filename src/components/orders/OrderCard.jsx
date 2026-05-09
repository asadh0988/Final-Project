// OrderCard component: displays order details and actions
import React, { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import OrderModal from './OrderModal';

const OrderCard = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/orders/${order.id}/cancel`);
      toast.success('Order cancelled');
      window.location.reload();
    } catch (err) {
      toast.error('Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    const scheduled_date = prompt('Enter schedule date (YYYY-MM-DD):');
    if (!scheduled_date) return;
    try {
      setLoading(true);
      await axios.patch(`/api/orders/${order.id}/schedule`, { scheduled_date });
      toast.success('Order scheduled');
      window.location.reload();
    } catch (err) {
      toast.error('Failed to schedule order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-card">
      <div>Order #{order.id}</div>
      <div>Status: {order.status}</div>
      <div>Details: {order.details}</div>
      <button onClick={() => setShowModal(true)}>View</button>
      <button onClick={handleCancel} disabled={loading || order.status === 'cancelled'}>Cancel</button>
      <button onClick={handleSchedule} disabled={loading || order.status === 'scheduled'}>Schedule</button>
      {showModal && <OrderModal order={order} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default OrderCard;

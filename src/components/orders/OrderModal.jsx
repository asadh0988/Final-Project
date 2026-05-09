// OrderModal component: shows order details in a modal
import React from 'react';

const OrderModal = ({ order, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Order #{order.id}</h2>
        <p>Status: {order.status}</p>
        <p>Details: {order.details}</p>
        <p>Scheduled Date: {order.scheduled_date || 'N/A'}</p>
        <p>Created At: {order.created_at}</p>
        <p>Updated At: {order.updated_at}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderModal;

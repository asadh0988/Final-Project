// OrderList component: lists all orders with actions
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import OrderCard from './OrderCard';
import toast from 'react-hot-toast';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/orders');
        setOrders(res.data.data.orders);
      } catch (err) {
        setError('Failed to fetch orders');
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;

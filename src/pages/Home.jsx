// Home page
import React from 'react';
import OrderList from '../components/orders/OrderList';
import NotificationDropdown from '../components/notifications/NotificationDropdown';

const Home = () => (
  <div>
    <NotificationDropdown />
    <h1>Welcome to Order App</h1>
    <OrderList />
  </div>
);

export default Home;

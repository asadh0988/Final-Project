// NotificationDropdown: shows unread count, lists notifications, mark as read on click, auto-refresh
import React, { useEffect, useState, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const NotificationDropdown = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/notifications/${user.id}`);
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.notifications.filter(n => !n.read).length);
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {}
  };

  return (
    <div className="notification-dropdown">
      <button onClick={() => setOpen(!open)}>
        Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="dropdown-menu">
          {notifications.length === 0 ? (
            <div>No notifications</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={n.read ? 'notification read' : 'notification unread'}
                onClick={() => markAsRead(n.id)}
              >
                {n.message}
                <span className="date">{new Date(n.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

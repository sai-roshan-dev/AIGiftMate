import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import './index.css';

const NotificationContainer = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification-toast notification-toast-${notification.type}`}>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

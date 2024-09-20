import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ticketsystem-backend-cbpv.onrender.com/ticket/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const formatTimestamp = (timestamp) => {
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {Array.isArray(notifications) && notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification._id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
            <p className="text-gray-800">{notification.message}</p>
            <p className="text-gray-500 text-sm">{formatTimestamp(notification.createdAt)}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 italic">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;

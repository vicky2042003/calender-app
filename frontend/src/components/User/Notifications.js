import React, { useState, useEffect } from "react";
import api from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    overdue: [],
    today: [],
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/user/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <h2>Overdue Communications</h2>
      <ul>
        {notifications.overdue.map((item, index) => (
          <li key={index}>
            {item.company_name} - {item.next_communication}
          </li>
        ))}
      </ul>

      <h2>Today's Communications [Urgent which has to be Done]</h2>
      <ul>
        {notifications.today.map((item, index) => (
          <li key={index}>
            {item.company_name} - {item.next_communication}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

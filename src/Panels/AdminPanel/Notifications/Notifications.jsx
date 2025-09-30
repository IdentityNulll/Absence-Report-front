import React, { useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Assignment", message: "Math homework due tomorrow", date: "2025-09-30" },
    { id: 2, title: "System Update", message: "Platform maintenance at 11 PM", date: "2025-09-29" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: "", message: "" });

  const handleCreate = () => {
    if (!newNotification.title || !newNotification.message) return;
    const newItem = {
      id: Date.now(),
      ...newNotification,
      date: new Date().toISOString().split("T")[0],
    };
    setNotifications([newItem, ...notifications]);
    setNewNotification({ title: "", message: "" });
    setShowPopup(false);
  };

  return (
    <div className="notifications-page">
      <Sidebar />

      <div className="notifications-container fade-in-up1">
        {/* Header with Create Button */}
        <div className="notifications-header">
          <h2 className="page-title">Notifications</h2>
          <button className="create-btn" onClick={() => setShowPopup(true)}>
            + Create
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list-card">
          {notifications.length === 0 ? (
            <p className="empty-text">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="notification-card">
                <div className="notification-content">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                </div>
                <span className="notification-date">{n.date}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Create Notification</h3>
            <input
              type="text"
              placeholder="Title"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            />
            <textarea
              placeholder="Message"
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
            ></textarea>

            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;

import React, { useState, useEffect } from "react";
import "./Notifications.css";
import Header from "../../../components/Header/Header";
import api from "../../../api/axios";
import Loader from "../../../components/loader/Loader";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
  });

  const senderId = localStorage.getItem("userId"); // ✅ your saved user id

  // ✅ Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notification/all");
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        // fallback dummy data if API fails
        setNotifications([
          {
            id: 1,
            title: "Fallback Notification",
            message: "Something went wrong with the backend.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Create new notification
  const handleCreate = async () => {
    if (!newNotification.title || !newNotification.message) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      const res = await api.post("/api/notification/add", {
        sender: senderId,
        recipient: [senderId], // can be dynamic later
        title: newNotification.title,
        message: newNotification.message,
      });

      // Add new one on top
      setNotifications((prev) => [res.data, ...prev]);

      // Reset form and close popup
      setNewNotification({ title: "", message: "" });
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to add notification:", err);
      alert("Failed to create notification.");
    }
  };

  return (
    <div className="notifications-page">
      <Header />

      <div className="container12">
        <div className="notifications-container">
          <div className="notifications-header">
            <h2 className="page-title">Notifications</h2>
            <button className="create-btn" onClick={() => setShowPopup(true)}>
              + Create
            </button>
          </div>

          {/* Notifications List */}
          <div className="notifications-list-card">
            {loading ? (
              <Loader/>
            ) : notifications.length === 0 ? (
              <p className="empty-text">No notifications yet</p>
            ) : (
              notifications.map((n, index) => (
                <div key={n.id || index} className="notification-card">
                  <div className="notification-content">
                    <h4>{n.title}</h4>
                    {n.message && <p>{n.message}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
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
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Message"
              value={newNotification.message}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  message: e.target.value,
                })
              }
            ></textarea>

            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
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

import React, { useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faGraduationCap,
  faUsers,
  faUserShield,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Profile() {
  const [activeRole, setActiveRole] = useState(null); // teacher | student | admin
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Dummy users for demo
  const users = {
    teacher: [{ name: "Mr. James", email: "james@school.com" }],
    student: [{ name: "Sarah", email: "sarah@student.com" }],
    admin: [{ name: "Admin John", email: "admin@school.com" }],
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="header-container">
        <div className="header-left">
          <Sidebar />
        </div>
        <div className="header-profile">
          <Link to={"/admin/notifications"} className="notification">
            <FontAwesomeIcon icon={faBell} /> <sup>8</sup>
          </Link>
          <Link to={"/admin/profile"} className="logo-img">
            S
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card" data-aos="fade-up">
        <FontAwesomeIcon icon={faUser} className="profile-icon" />
        <h2>Sarah Johnson</h2>
        <p className="profile-role">System Admin</p>
        <button
          className="btn-gradient"
          onClick={() => setShowPasswordModal(true)}
        >
          <FontAwesomeIcon icon={faLock} /> Change Password
        </button>
      </div>

      {/* Role Management */}
      <div className="role-section" data-aos="fade-up">
        <h3>Manage Users</h3>
        <div className="role-buttons">
          <button
            className="btn-outline"
            onClick={() => {
              setActiveRole("teacher");
              setShowRoleModal(true);
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} /> Teachers
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              setActiveRole("student");
              setShowRoleModal(true);
            }}
          >
            <FontAwesomeIcon icon={faUsers} /> Students
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              setActiveRole("admin");
              setShowRoleModal(true);
            }}
          >
            <FontAwesomeIcon icon={faUserShield} /> Admins
          </button>
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{activeRole?.toUpperCase()} List</h3>
            <ul>
              {users[activeRole]?.map((u, i) => (
                <li key={i}>
                  <strong>{u.name}</strong> - {u.email}
                </li>
              ))}
            </ul>
            <button
              className="btn-gradient"
              onClick={() => setShowCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Create {activeRole}
            </button>
            <button
              className="btn-close"
              onClick={() => setShowRoleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create {activeRole}</h3>
            <form className="create-form">
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="btn-gradient">
                Create
              </button>
            </form>
            <button
              className="btn-close"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form className="create-form">
              <input type="password" placeholder="Old Password" required />
              <input type="password" placeholder="New Password" required />
              <input
                type="password"
                placeholder="Confirm New Password"
                required
              />
              <button type="submit" className="btn-gradient">
                Update
              </button>
            </form>
            <button
              className="btn-close"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

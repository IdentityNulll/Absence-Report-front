import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
  faSun,
  faSignal,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faCalendar,
  faBell,
  faHouse,
} from "@fortawesome/free-regular-svg-icons";
import "./Sidebar.css";
import ThemeSwitcher from "../ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    closeSidebar();
    navigate("/");
  };

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-text">
            <div className="logo-img1">S</div>
            <div className="logo-text1">
              <h4>Sarah Mitchell</h4>
              <p>Role</p>
            </div>
          </div>
          <button className="close-btn" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <hr style={{ opacity: "0.6" }} />

        <nav className="menu">
          <Link to={"/admin/dashboard"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faHouse} className="house" />{" "}
            <span>Dashboard</span>
          </Link>
          <Link to={"/admin/profile"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faUser} className="user" />{" "}
            <span>My Profile</span>
          </Link>
          <Link to={"/admin/schedule"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faCalendar} className="calendar" />{" "}
            <span>Lesson Schedule</span>
          </Link>
          <Link to={"/admin/notifications"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faBell} className="bell" />{" "}
            <span>Notifications</span>
          </Link>
          <Link to={"/admin/analytics"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faChartLine} className="analytics" />{" "}
            <span>Analytics</span>
          </Link>
          <Link to={"/admin/manageusers"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faSun} className="Sun" />{" "}
            <span>Manage Users</span>
          </Link>
          <Link to={"/admin/stats"} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faSignal} className="signal" />{" "}
            <span>Stats For Today</span>
          </Link>
        </nav>
        <hr style={{ opacity: "0.6", margin: "20px" }} />

        <ThemeSwitcher />
        <div className="logout">
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default Sidebar;

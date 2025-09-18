import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //   faUser,
  //   faCalendar,
  //   faBell,
  faChartLine,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";
import {
  faUser,
  faCalendar,
  faBell,
} from "@fortawesome/free-regular-svg-icons";
import ThemeSwitcher from "../ThemeSwitcher";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-text">
            <div className="logo-img">S</div>
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
        </nav>
        <hr style={{ opacity: "0.6", margin: "20px" }} />

        <ThemeSwitcher />
        <div className="logout">
          <a href="/login" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default Sidebar;

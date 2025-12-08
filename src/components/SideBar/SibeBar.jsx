import React, { useEffect, useState } from "react";
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
import api from "../../api/axios";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    closeSidebar();
    navigate("/");
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const response = await api.get(`/admin/${id}`);
        const admin = response.data?.data;

        // Handle photo
        if (admin.photoUrl) {
          const imageRes = await api.get(admin.photoUrl, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
          });

          const imageURL = URL.createObjectURL(imageRes.data);
          setProfileUrl(imageURL);
        } else {
          setProfileUrl(null);
        }

        setStudent(admin);
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };

    fetchAdmin();
  }, []);

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
            <Link to={"/admin/profile"} className="logo-img1">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="profile"
                  className="sidebar-avatar"
                  width={"100%"}
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                student?.firstName?.charAt(0) || "?"
              )}
            </Link>

            <div className="logo-text1">
              {student ? `${student.firstName}` : `Loading ...`}
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

import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-left">
            <Sidebar />
          </div>
          <div className="header-profile">
            <p className="notification">
              <FontAwesomeIcon icon={faBell} /> <sup>8</sup>
            </p>
            <Link to={"/admin/profile"} className="logo-img">
              S
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-left">
          <div className="welcome-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div>
            <h3>Welcome back, Sarah!</h3>
            <p>Manage your classes and track student progress</p>
          </div>
        </div>
        <div className="welcome-right">
          <p>Current Time</p>
          <div className="time">{formatTime(currentTime)}</div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

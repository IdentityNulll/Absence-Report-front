import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import {
  faBell,
  faBookmark,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { faGraduationCap, faUsers } from "@fortawesome/free-solid-svg-icons";
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
    <body className="body">
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
      <div className="stats">
        <div className="stats-box item1">
          <FontAwesomeIcon icon={faBookmark} />
          <p className="number">4</p>
          <p className="text">{t("dashboard.stats-classes")}</p>
        </div>
        <div className="stats-box item2">
          <FontAwesomeIcon icon={faUsers} />
          <p className="number">100</p>
          <p className="text">{t("dashboard.stats-students")}</p>
        </div>
        <div className="stats-box item3">
          <FontAwesomeIcon icon={faClock} />
          <p className="number">12</p>
          <p className="text">{t("dashboard.stats-hours")}</p>
        </div>
        <div className="stats-box item4">
          <FontAwesomeIcon icon={faGraduationCap} />
          <p className="number">95%</p>
          <p className="text">{t("dashboard.stats-rate")}</p>
        </div>
      </div>
      {/* Classes + Quick Stats */}
      <div className="classes-container">
        {/* My Classes */}
        <div className="my-classes">
          <h3>
            <FontAwesomeIcon icon={faGraduationCap} /> My Classes
          </h3>

          <div className="class-card purple">
            <div className="class-left">
              <div className="class-icon">M</div>
              <div>
                <h4>Mathematics A</h4>
                <p>Room 101 • Mon, Wed, Fri - 8:00 AM</p>
              </div>
            </div>
            <span className="students">28 students</span>
          </div>

          <div className="class-card blue">
            <div className="class-left">
              <div className="class-icon">P</div>
              <div>
                <h4>Physics</h4>
                <p>Lab 203 • Tue, Thu - 10:00 AM</p>
              </div>
            </div>
            <span className="students">24 students</span>
          </div>

          <div className="class-card green">
            <div className="class-left">
              <div className="class-icon">C</div>
              <div>
                <h4>Chemistry</h4>
                <p>Lab 205 • Mon, Wed, Fri - 2:00 PM</p>
              </div>
            </div>
            <span className="students">26 students</span>
          </div>

          <div className="class-card orange">
            <div className="class-left">
              <div className="class-icon">AM</div>
              <div>
                <h4>Advanced Mathematics</h4>
                <p>Room 102 • Tue, Thu - 3:00 PM</p>
              </div>
            </div>
            <span className="students">22 students</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <h3>Quick Stats</h3>

          <div className="quick-card present">
            <p>
              <span>●</span> Present Today{" "}
            </p>
            <strong>25</strong>
          </div>
          <div className="quick-card absent">
            <p>
              <span>●</span> Absent Today{" "}
            </p>
            <strong>2</strong>
          </div>
          <div className="quick-card late">
            <p>
              <span>●</span> Late Arrivals
            </p>{" "}
            <strong>1</strong>
          </div>
        </div>
      </div>
    </body>
  );
}

export default Dashboard;

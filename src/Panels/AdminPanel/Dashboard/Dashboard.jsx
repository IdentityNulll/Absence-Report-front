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
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import Loader from "../../../components/loader/Loader";
import AdminAnimate from "../../../components/Animation/AdminAnimate";

function Dashboard() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, studentRes] = await Promise.all([
          api.get("class/all"),
          api.get("student"),
        ]);

        setClasses(classRes.data.data || []);
        setStudents(studentRes.data.data || []);
        console.log(classes);

        const total = studentRes.data.data?.length || 0;
        const presentCount = studentRes.data.data?.filter(
          (s) => s.status === "PRESENT" || s.attendance === "present"
        ).length;
        setAttendanceRate(
          total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="body">
        <Header />

        {/* Welcome Card */}
        <div className="welcome-card fade-in-right">
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

        {/* Stats Section */}
        <div className="stats fade-in-left">
          <div className="stats-box item1">
            <FontAwesomeIcon icon={faBookmark} />
            <p className="number">{classes.length}</p>
            <p className="text">{t("dashboard.stats-classes")}</p>
          </div>
          <div className="stats-box item2">
            <FontAwesomeIcon icon={faUsers} />
            <p className="number">{students.length}</p>
            <p className="text">{t("dashboard.stats-students")}</p>
          </div>
          <div className="stats-box item3">
            <FontAwesomeIcon icon={faClock} />
            <p className="number">—</p>
            <p className="text">{t("dashboard.stats-hours")}</p>
          </div>
          <div className="stats-box item4">
            <FontAwesomeIcon icon={faGraduationCap} />
            <p className="number">{attendanceRate}%</p>
            <p className="text">{t("dashboard.stats-rate")}</p>
          </div>
        </div>

        {/* Classes + Quick Stats */}
        <div className="classes-container fade-in-up">
          {/* My Classes */}
          <div className="my-classes">
            <h3>
              <FontAwesomeIcon icon={faGraduationCap} /> My Classes
            </h3>

            {classes.slice(0, 4).map((cls) => (
              <div className="class-card purple" key={cls.uuid}>
                <div className="class-left">
                  <div className="class-icon">
                    {cls.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4>{cls.name}</h4>
                    <p>Teacher: {cls.teacher}</p>
                  </div>
                </div>
                <span className="students">{cls.studentCount} students</span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="quick-card present">
              <p>
                <span>●</span> Present Today
              </p>
              <strong>
                {
                  students.filter(
                    (s) => s.status === "PRESENT" || s.attendance === "present"
                  ).length
                }
              </strong>
            </div>
            <div className="quick-card absent">
              <p>
                <span>●</span> Absent Today
              </p>
              <strong>
                {
                  students.filter(
                    (s) => s.status === "ABSENT" || s.attendance === "absent"
                  ).length
                }
              </strong>
            </div>
            <div className="quick-card late">
              <p>
                <span>●</span> Late Arrivals
              </p>
              <strong>
                {
                  students.filter(
                    (s) => s.status === "LATE" || s.attendance === "late"
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

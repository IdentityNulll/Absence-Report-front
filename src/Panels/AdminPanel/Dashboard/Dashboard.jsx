import React, { useEffect, useState } from "react";
import { faBookmark, faClock } from "@fortawesome/free-regular-svg-icons";
import { faGraduationCap, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";

function Dashboard() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLessons = async () => {
    const res = await api.get("/lessons");
    setLessons(res.data?.data || []);
  };

  const fetchClasses = async () => {
    const res = await api.get("/class/all");
    setClasses(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchLessons(), fetchClasses()]);

        const studentRes = await api.get("student");
        const id = localStorage.getItem("id");
        const adminRes = await api.get(`/admin/${id}`);

        setAdmin(adminRes.data?.data);

        if (Array.isArray(studentRes.data?.data)) {
          const data = studentRes.data.data;
          setStudents(data);

          const presentCount = data.filter(
            (s) => s.status === "PRESENT" || s.attendance === "present"
          ).length;

          setAttendanceRate(
            data.length > 0
              ? ((presentCount / data.length) * 100).toFixed(1)
              : 0
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (loading) return <Loader />;

  return (
    <div className="body">
      <Header />

      <div className="welcome-card fade-in-right">
        <div className="welcome-left">
          <div className="welcome-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="welcome-back">
            <h3>Welcome back, {admin?.firstName || "Guest"}</h3>
            <p>Manage your classes and track student progress</p>
          </div>
        </div>
        <div className="welcome-right">
          <p>Current Time</p>
          <div className="time">{formatTime(currentTime)}</div>
        </div>
      </div>

      <div className="stats fade-in-left">
        <Link to="/admin/manageusers" className="stats-box item1">
          <FontAwesomeIcon icon={faBookmark} />
          <p className="number">{classes.length}</p>
          <p className="text">{t("dashboard.stats-classes")}</p>
        </Link>
        <Link to="/admin/manageusers" className="stats-box item2">
          <FontAwesomeIcon icon={faUsers} />
          <p className="number">{students.length}</p>
          <p className="text">{t("dashboard.stats-students")}</p>
        </Link>
        <Link to="/admin/schedule" className="stats-box item3">
          <FontAwesomeIcon icon={faClock} />
          <p className="number">{lessons.length}</p>
          <p className="text">Total Lessons</p>
        </Link>
        <Link to="/admin/analytics" className="stats-box item4">
          <FontAwesomeIcon icon={faGraduationCap} />
          <p className="number">{attendanceRate}%</p>
          <p className="text">{t("dashboard.stats-rate")}</p>
        </Link>
      </div>

      <div className="classes-container fade-in-up">
        <div className="my-classes">
          <h3>
            <FontAwesomeIcon icon={faGraduationCap} /> My Classes
          </h3>
          {classes.slice(0, 4).map((cls) => (
            <Link
              to={`/admin/class/${encodeURIComponent(cls.name)}`}
              key={cls.uuid}
              className="class-card purple"
            >
              <div className="class-left">
                <div className="class-icon">
                  {cls.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4>{cls.name}</h4>
                </div>
              </div>
              <span className="students">
                {cls.students?.length || 0} students
              </span>
            </Link>
          ))}
        </div>

        <div className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="quick-card absent">
            <p>
              <span>●</span> Absent Today
            </p>
            <strong>2</strong>
          </div>
          <div className="quick-card late">
            <p>
              <span>●</span> Late Arrivals
            </p>
            <strong>2</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
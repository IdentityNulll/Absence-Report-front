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
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, studentRes] = await Promise.allSettled([
          api.get("class/all"),
          api.get("student"),
        ]);

        // ✅ Dummy fallback data
        const dummyClasses = [
          { uuid: "1", name: "9-A", teacher: "Mr. Anderson", studentCount: 25 },
          { uuid: "2", name: "10-B", teacher: "Ms. Carter", studentCount: 28 },
          { uuid: "3", name: "11-C", teacher: "Mr. Brown", studentCount: 30 },
          { uuid: "4", name: "8-D", teacher: "Ms. Lee", studentCount: 22 },
        ];

        const dummyStudents = [
          { name: "Alice", status: "PRESENT" },
          { name: "Bob", status: "ABSENT" },
          { name: "Charlie", status: "LATE" },
          { name: "Diana", status: "PRESENT" },
          { name: "Ethan", status: "PRESENT" },
        ];

        const backendClasses =
          classRes.status === "fulfilled" &&
          Array.isArray(classRes.value?.data?.data) &&
          classRes.value.data.data.length > 0
            ? classRes.value.data.data
            : dummyClasses;

        const backendStudents =
          studentRes.status === "fulfilled" &&
          Array.isArray(studentRes.value?.data?.data) &&
          studentRes.value.data.data.length > 0
            ? studentRes.value.data.data
            : dummyStudents;

        setClasses(backendClasses);
        setStudents(backendStudents);

        const total = backendStudents.length;
        const presentCount = backendStudents.filter(
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
        <Link to={"/admin/manageusers"} className="stats-box item1">
          <FontAwesomeIcon icon={faBookmark} />
          <p className="number">{classes.length}</p>
          <p className="text">{t("dashboard.stats-classes")}</p>
        </Link>
        <Link to={"/admin/manageusers"} className="stats-box item2">
          <FontAwesomeIcon icon={faUsers} />
          <p className="number">{students.length}</p>
          <p className="text">{t("dashboard.stats-students")}</p>
        </Link>
        <Link to={"/admin/schedule"} className="stats-box item3">
          <FontAwesomeIcon icon={faClock} />
          <p className="number">3</p>
          <p className="text">{t("dashboard.stats-hours")}</p>
        </Link>
        <Link to={"/admin/analytics"} className="stats-box item4">
          <FontAwesomeIcon icon={faGraduationCap} />
          <p className="number">{attendanceRate}%</p>
          <p className="text">{t("dashboard.stats-rate")}</p>
        </Link>
      </div>

      <div className="classes-container fade-in-up">
        {/* My Classes */}
        <Link to={"/admin/manageusers"}  className="my-classes">
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
        </Link>

        {/* Quick Stats */}
        <Link to={"/admin/stats"} className="quick-stats">
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
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

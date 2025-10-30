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
          api.get("/class/all"),
          api.get("student"),
        ]);

        // ✅ Classes
        if (
          classRes.status === "fulfilled" &&
          Array.isArray(classRes.value?.data)
        ) {
          const data = classRes.value.data;
          if (data.length === 0) {
            console.warn("⚠️ No class data returned from API.");
          }
          setClasses(
            data.map((cls) => ({
              uuid: cls.uuid || Math.random().toString(),
              name: cls.name || "Unknown",
            }))
          );
        } else {
          console.error("❌ Failed to fetch classes:", classRes.reason);
        }

        // ✅ Students
        if (
          studentRes.status === "fulfilled" &&
          Array.isArray(studentRes.value?.data?.data)
        ) {
          const data = studentRes.value.data.data;
          if (data.length === 0) {
            console.warn("⚠️ No student data returned from API.");
          }
          setStudents(data);
        } else {
          console.error("❌ Failed to fetch students:", studentRes.reason);
        }

        // ✅ Attendance Rate
        const total =
          studentRes.status === "fulfilled" &&
          studentRes.value?.data?.data?.length
            ? studentRes.value.data.data.length
            : 0;
        const presentCount =
          total > 0
            ? studentRes.value.data.data.filter(
                (s) => s.status === "PRESENT" || s.attendance === "present"
              ).length
            : 0;
        setAttendanceRate(
          total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0
        );
      } catch (error) {
        console.error(
          "🚨 Unexpected error while fetching dashboard data:",
          error
        );
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
                  <p>Teacher: Unknown</p>
                </div>
              </div>
              <span className="students">0 students</span>
            </Link>
          ))}
        </div>

        <div className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="quick-card absent">
            <p>
              <span>●</span> Absent Today
            </p>
            <strong>
              {/* {
                students.filter(
                  (s) => s.status === "ABSENT" || s.attendance === "absent"
                ).length
              } */}
              2
            </strong>
          </div>
          <div className="quick-card late">
            <p>
              <span>●</span> Late Arrivals
            </p>
            <strong>
              {/* {
                students.filter(
                  (s) => s.status === "LATE" || s.attendance === "late"
                ).length
              } */}
              2
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useMemo, useState } from "react";
import { faBookmark, faClock } from "@fortawesome/free-regular-svg-icons";
import { faGraduationCap, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Dashboard.css";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [classes, setClasses] = useState([]);
  const [admin, setAdmin] = useState(null);

  const [attendanceRate, setAttendanceRate] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= TIME ================= */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [lessonRes, classRes, studentRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/class/all"),
          api.get("/student"),
        ]);

        const lessonsData = lessonRes.data?.data || [];
        const classesData = Array.isArray(classRes.data) ? classRes.data : [];
        const studentsData = Array.isArray(studentRes.data?.data)
          ? studentRes.data.data
          : [];

        setLessons(lessonsData);
        setClasses(classesData);
        setStudents(studentsData);

        if (classesData[0]?.uuid) {
          await fetchAttendanceStats(
            classesData[0].uuid,
            studentsData.length
          );
        }

        const adminId = localStorage.getItem("id");
        if (adminId) {
          const adminRes = await api.get(`/admin/${adminId}`);
          setAdmin(adminRes.data?.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= ATTENDANCE ================= */
  const fetchAttendanceStats = async (classId, totalStudents) => {
    const res = await api.get("/attendance");
    const data = Array.isArray(res.data?.data) ? res.data.data : [];

    const absent = data.filter((i) => i.reasonType === "ABSENT").length;
    const late = data.filter((i) => i.reasonType === "LATE").length;

    setAbsentCount(absent);
    setLateCount(late);

    if (totalStudents > 0) {
      const present = totalStudents - absent;
      const rate = Math.round((present / totalStudents) * 100);
      setAttendanceRate(rate);
    }
  };

  /* ================= MEMO ================= */
  const visibleClasses = useMemo(() => classes.slice(0, 4), [classes]);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (loading) return <Loader />;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main className="body">
      <Header />

      {/* ============ WELCOME ============ */}
      <section
        className="welcome-card fade-in-right"
        aria-labelledby="welcome-title"
      >
        <div className="welcome-left">
          <div className="welcome-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="welcome-back">
            <h1 id="welcome-title">
              Welcome back, {admin?.firstName || "Guest"}
            </h1>
            <p>Manage your classes and track student progress</p>
          </div>
        </div>

        <div className="welcome-right">
          <p>Current Time</p>
          <div className="time" aria-live="polite">
            {formatTime(currentTime)}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats fade-in-left">
        <Link
          to="/admin/manageusers"
          className="stats-box"
          aria-label="View classes"
        >
          <FontAwesomeIcon icon={faBookmark} aria-hidden="true" />
          <p className="number">{classes.length}</p>
          <p className="text">Total Classes</p>
        </Link>

        <Link
          to="/admin/manageusers"
          className="stats-box"
          aria-label="View students"
        >
          <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
          <p className="number">{students.length}</p>
          <p className="text">Total Students</p>
        </Link>

        <Link
          to="/admin/schedule"
          className="stats-box"
          aria-label="View lessons"
        >
          <FontAwesomeIcon icon={faClock} aria-hidden="true" />
          <p className="number">{lessons.length}</p>
          <p className="text">Total Lessons</p>
        </Link>

        <Link
          to="/admin/analytics"
          className="stats-box"
          aria-label="View attendance rate"
        >
          <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" />
          <p className="number">{attendanceRate}%</p>
          <p className="text">Attendance Rate</p>
        </Link>
      </section>

      {/* ============ CLASSES & QUICK STATS ============ */}
      <section className="classes-container fade-in-up">
        <article className="my-classes">
          <h2>
            <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" /> My
            Classes
          </h2>

          {visibleClasses.map((cls) => (
            <Link
              to={`/admin/class/${cls.uuid}`}
              key={cls.uuid}
              className="class-card"
              aria-label={`View class ${cls.name}`}
            >
              <div className="class-left">
                <div className="class-icon">
                  {cls.name.slice(0, 2).toUpperCase()}
                </div>
                <h3>{cls.name}</h3>
              </div>

              <span className="students">
                {cls.students?.length || 0} students
              </span>
            </Link>
          ))}
        </article>

        <aside className="quick-stats">
          <h2>Quick Stats</h2>

          <div className="quick-card absent">
            <p>
              <span aria-hidden="true">●</span> Absent Today
            </p>
            <strong>{absentCount}</strong>
          </div>

          <div className="quick-card late">
            <p>
              <span aria-hidden="true">●</span> Late Arrivals
            </p>
            <strong>{lateCount}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Dashboard;

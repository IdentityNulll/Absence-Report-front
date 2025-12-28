import { useEffect, useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";
import api from "../../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  "Period 1",
  "Period 2",
  "Period 3",
  "Period 4",
  "Period 5",
  "Period 6",
];

const DAY_ENUM = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
};

const PERIOD_ENUM = {
  "Period 1": "FIRST",
  "Period 2": "SECOND",
  "Period 3": "THIRD",
  "Period 4": "FOURTH",
  "Period 5": "FIFTH",
  "Period 6": "SIXTH",
};

export default function Schedule() {
  const [schedule, setSchedule] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    day: DAYS[0],
    period: PERIODS[0],
    teacherId: "",
    classId: "",
  });

  const selectedDay = DAYS[dayIndex];

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([fetchLessons(), fetchTeachers(), fetchClasses()]);
  };

  const fetchTeachers = async () => {
    const res = await api.get("/teachers");
    setTeachers(res.data?.data || []);
  };

  const fetchClasses = async () => {
    const res = await api.get("/class/all");
    setClasses(res.data || []);
  };

  const fetchLessons = async () => {
    const res = await api.get("/lessons");
    const lessons = res.data?.data || [];
    const normalized = {};

    lessons.forEach((l) => {
      const day = Object.keys(DAY_ENUM).find(
        (d) => DAY_ENUM[d] === l.dayOfWeek
      );
      const period = Object.keys(PERIOD_ENUM).find(
        (p) => PERIOD_ENUM[p] === l.period
      );
      if (!day || !period) return;

      normalized[day] ??= {};
      normalized[day][period] = {
        id: l.id,
        subject: l.name,
        teacher: l.teacherResponseDto
          ? `${l.teacherResponseDto.firstName} ${l.teacherResponseDto.lastName}`
          : "—",
        className: l.classResponseDto?.name || "—",
      };
    });

    setSchedule(normalized);
  };

  const createLesson = async () => {
    await api.post("/lessons", {
      name: form.name,
      teacherId: form.teacherId,
      classId: form.classId,
      dayOfWeek: DAY_ENUM[form.day],
      period: PERIOD_ENUM[form.period],
    });

    setShowModal(false);
    setForm({
      name: "",
      day: DAYS[0],
      period: PERIODS[0],
      teacherId: "",
      classId: "",
    });

    fetchLessons();
  };

  const deleteLesson = async (id) => {
    await api.delete(`/lessons/${id}`);
    fetchLessons();
  };

  return (
    <main className="schedule-page">
      <Header />

      <section className="day-selector">
        <button
          className="arrow-btn"
          aria-label="Previous day"
          onClick={() => setDayIndex((p) => (p === 0 ? DAYS.length - 1 : p - 1))}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h1 className="selected-day-title">{selectedDay}</h1>

        <button
          className="arrow-btn"
          aria-label="Next day"
          onClick={() => setDayIndex((p) => (p === DAYS.length - 1 ? 0 : p + 1))}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </section>

      <button className="create-btn" onClick={() => setShowModal(true)}>
        + Create Lesson
      </button>

      <section className="schedule-grid">
        {PERIODS.map((period) => {
          const lesson = schedule[selectedDay]?.[period];

          return (
            <div key={period} className="lesson-row">
              <div className="period-info">
                <strong>{period}</strong>
              </div>

              <div className="lesson-content1">
                {lesson ? (
                  <div className="lesson-box">
                    <div className="lesson-box-content">
                      <h2 className="class-name">{lesson.subject}</h2>
                      <p className="class-tag">
                        Teacher — {lesson.teacher}
                      </p>
                      <span className="class-tag1">
                        Class — {lesson.className}
                      </span>
                    </div>

                    <button
                      className="delete-btn"
                      aria-label="Delete lesson"
                      onClick={() => deleteLesson(lesson.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ) : (
                  <span className="empty-slot">No lesson</span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Create Lesson</h2>

            <input
              placeholder="Lesson name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <select
              value={form.teacherId}
              onChange={(e) =>
                setForm({ ...form, teacherId: e.target.value })
              }
            >
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>

            <select
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                onClick={createLesson}
                disabled={!form.name || !form.teacherId || !form.classId}
              >
                Save
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

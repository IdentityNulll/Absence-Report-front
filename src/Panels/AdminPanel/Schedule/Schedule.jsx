import React, { useEffect, useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";
import api from "../../../api/axios";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const periods = [
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    day: "Monday",
    period: "Period 1",
    teacherId: "",
    classId: "",
  });

  const selectedDay = days[selectedDayIndex];

  useEffect(() => {
    fetchLessons();
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get("/class/all");
      console.log(res)
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      const lessons = res.data.data;

      console.log(lessons);
      const normalized = {};

      lessons.forEach((l) => {
        const dayKey = Object.keys(DAY_ENUM).find(
          (d) => DAY_ENUM[d] === l.dayOfWeek
        );

        const periodKey = Object.keys(PERIOD_ENUM).find(
          (p) => PERIOD_ENUM[p] === l.period
        );

        if (!dayKey || !periodKey) {
          console.warn("Skipped lesson (bad day/period):", l);
          return;
        }

        if (!normalized[dayKey]) {
          normalized[dayKey] = {};
        }

        normalized[dayKey][periodKey] = {
          id: l.id,
          subject: l.name,
          teacher: l.teacherResponseDto
            ? `${l.teacherResponseDto.firstName} ${l.teacherResponseDto.lastName}`
            : "—",
          className: l.classResponseDto?.name || "—",
        };
      });

      setSchedule(normalized);
    } catch (err) {
      console.error("Failed to fetch lessons", err);
    }
  };

  // ================= ACTIONS =================
  const createLesson = async () => {
    try {
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
        day: "Monday",
        period: "Period 1",
        teacherId: "",
        classId: "",
      });

      fetchLessons();
    } catch (err) {
      console.error("Create lesson failed", err);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await api.delete(`/lessons/${id}`);
      fetchLessons();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ================= UI =================
  return (
    <div className="schedule-page">
      <Header />

      <div className="day-selector">
        <button
          onClick={() => setSelectedDayIndex((p) => (p === 0 ? 5 : p - 1))}
        >
          ◀
        </button>
        <h2>{selectedDay}</h2>
        <button
          onClick={() => setSelectedDayIndex((p) => (p === 5 ? 0 : p + 1))}
        >
          ▶
        </button>
      </div>

      <button className="create-btn" onClick={() => setShowModal(true)}>
        + Create Lesson
      </button>

      <div className="schedule-grid">
        {periods.map((p) => {
          const lesson = schedule[selectedDay]?.[p];

          return (
            <div key={p} className="lesson-row">
              <strong>{p}</strong>

              {lesson ? (
                <div className="lesson-box">
                  <h4>{lesson.subject}</h4>
                  <p>{lesson.teacher}</p>
                  <span>{lesson.className}</span>
                  <button onClick={() => deleteLesson(lesson.id)}>🗑</button>
                </div>
              ) : (
                <span>— No lesson —</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create Lesson</h3>

            <input
              placeholder="Lesson name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* 🔥 TEACHER */}
            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>

            {/* 🔥 CLASS */}
            <select
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
            >
              <option value="">Select Class</option>
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
    </div>
  );
}

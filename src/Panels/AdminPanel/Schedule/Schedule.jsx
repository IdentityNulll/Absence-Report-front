import React, { useEffect, useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";
import api from "../../../api/axios";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["Period 1","Period 2","Period 3","Period 4","Period 5","Period 6"];

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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: "",
    day: "Monday",
    period: "Period 1",
    teacherId: "",
  });

  // dummy teachers (enum)
  const teachers = [
    { id: "111", name: "Mr. Adams" },
    { id: "222", name: "Ms. Clark" },
    { id: "333", name: "Dr. Lee" },
  ];

  const selectedDay = days[selectedDayIndex];

  // 🔥 FETCH LESSONS
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const res = await api.get("/api/lessons");
    const lessons = res.data.data;

    const normalized = {};

    lessons.forEach((l) => {
      const day = Object.keys(DAY_ENUM).find(
        (k) => DAY_ENUM[k] === l.dayOfWeek
      );

      const period = Object.keys(PERIOD_ENUM).find(
        (k) => PERIOD_ENUM[k] === l.period
      );

      if (!normalized[day]) normalized[day] = {};

      normalized[day][period] = {
        id: l.id,
        subject: l.name,
        teacher: `${l.teacherResponseDto.firstName} ${l.teacherResponseDto.lastName}`,
        className: l.classResponseDto.name,
      };
    });

    setSchedule(normalized);
  };

  // 🔥 CREATE LESSON
  const createLesson = async () => {
    await api.post("/api/lessons", {
      name: form.name,
      teacherId: form.teacherId,
      dayOfWeek: DAY_ENUM[form.day],
      period: PERIOD_ENUM[form.period],
    });

    setShowModal(false);
    fetchLessons();
  };

  // 🔥 DELETE LESSON
  const deleteLesson = async (id) => {
    await api.delete(`/api/lessons/${id}`);
    fetchLessons();
  };

  return (
    <div className="schedule-page">
      <Header />

      <div className="day-selector">
        <button onClick={() => setSelectedDayIndex((p) => (p === 0 ? 5 : p - 1))}>◀</button>
        <h2>{selectedDay}</h2>
        <button onClick={() => setSelectedDayIndex((p) => (p === 5 ? 0 : p + 1))}>▶</button>
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

      {/* 🔥 MODAL */}
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
              {days.map((d) => <option key={d}>{d}</option>)}
            </select>

            <select
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              {periods.map((p) => <option key={p}>{p}</option>)}
            </select>

            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={createLesson}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

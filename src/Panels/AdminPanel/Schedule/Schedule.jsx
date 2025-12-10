import React, { useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";

export default function Schedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const periods = ["Period 1","Period 2","Period 3","Period 4","Period 5","Period 6"];

  const periodTimes = {
    "Period 1": "09:00 - 10:00",
    "Period 2": "10:10 - 11:10",
    "Period 3": "11:20 - 12:20",
    "Period 4": "13:00 - 14:00",
    "Period 5": "14:10 - 15:10",
    "Period 6": "15:20 - 16:20",
  };

  const [schedule, setSchedule] = useState({
    Monday: {
      "Period 1": { subject: "Math", room: "201", teacher: "Mr. Adams", className: "9-A" },
      "Period 3": { subject: "Physics", room: "202", teacher: "Ms. Clark", className: "9-A" },
    },
    Tuesday: {
      "Period 2": { subject: "English", room: "101", teacher: "Mrs. Miller", className: "9-A" },
      "Period 5": { subject: "Chemistry", room: "305", teacher: "Dr. Lee", className: "9-A" },
    },
    Wednesday: {},
    Thursday: {
      "Period 4": { subject: "Biology", room: "302", teacher: "Mr. Green", className: "9-A" },
    },
    Friday: {},
    Saturday: {},
  });

  // Detect real today (optional)
  const todayIndex = new Date().getDay() - 1; 
  const validToday = todayIndex >= 0 && todayIndex <= 5 ? todayIndex : 0;

  const [selectedDayIndex, setSelectedDayIndex] = useState(validToday);
  const selectedDay = days[selectedDayIndex];

  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => (prev === 0 ? days.length - 1 : prev - 1));
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => (prev === days.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="schedule-page">
      <Header />

      {/* 🔥 Day Header with Arrows */}
      <div className="day-selector fade-in-up">
        <button className="arrow-btn" onClick={handlePrevDay}>◀</button>

        <h2 className="selected-day-title">{selectedDay}</h2>

        <button className="arrow-btn" onClick={handleNextDay}>▶</button>
      </div>

      {/* 🔥 Show ONLY selected day's lessons */}
      <div className="schedule-grid fade-in-up">
        {periods.map((period) => {
          const lesson = schedule[selectedDay]?.[period];

          return (
            <div key={period} className="lesson-row">
              <div className="period-info">
                <strong>{period}</strong>
                <p className="period-time">{periodTimes[period]}</p>
              </div>

              <div className="lesson-content">
                {lesson ? (
                  <div className="lesson-box colorful-box">
                    <h4>{lesson.subject}</h4>
                    <p>Room {lesson.room}</p>
                    <p>{lesson.teacher}</p>
                    <span className="class-tag">{lesson.className}</span>
                  </div>
                ) : (
                  <span className="empty-slot">— No lesson —</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

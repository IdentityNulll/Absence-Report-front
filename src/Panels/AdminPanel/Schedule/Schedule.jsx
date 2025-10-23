import React, { useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";

export default function Schedule() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [newLesson, setNewLesson] = useState({
    subject: "",
    room: "",
    period: "",
    teacher: "",
    className: "",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Period 6",
  ];

  const periodTimes = {
    "Period 1": "09:00 - 10:00",
    "Period 2": "10:10 - 11:10",
    "Period 3": "11:20 - 12:20",
    "Period 4": "13:00 - 14:00",
    "Period 5": "14:10 - 15:10",
    "Period 6": "15:20 - 16:20",
  };

  // 🧩 Example lessons
  const [schedule, setSchedule] = useState({
    Monday: {
      "Period 1": { subject: "Math", room: "201", teacher: "Mr. Adams", className: "9-A" },
      "Period 3": { subject: "Physics", room: "202", teacher: "Ms. Clark", className: "10-B" },
    },
    Tuesday: {
      "Period 2": { subject: "English", room: "101", teacher: "Mrs. Miller", className: "8-A" },
      "Period 5": { subject: "Chemistry", room: "305", teacher: "Dr. Lee", className: "9-B" },
    },
    Wednesday: {},
    Thursday: { "Period 4": { subject: "Biology", room: "302", teacher: "Mr. Green", className: "10-A" } },
    Friday: {},
    Saturday: {},
  });

  const handleAddLesson = () => {
    if (!newLesson.subject || !newLesson.room || !newLesson.period || !newLesson.teacher || !newLesson.className)
      return alert("Please fill all fields");

    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [newLesson.period]: { ...newLesson },
      },
    }));

    setShowPopup(false);
    setNewLesson({ subject: "", room: "", period: "", teacher: "", className: "" });
  };

  return (
    <div className="schedule-page">
      <Header />

      <div className="schedule-grid fade-in-up">
        <div className="grid-header">
          <div className="grid-cell period-title"></div>
          {days.map((day) => (
            <div key={day} className="grid-day-header">
              <div className="day-header-top">
                <h3>{day}</h3>
                <button
                  className="add-btn"
                  onClick={() => {
                    setSelectedDay(day);
                    setShowPopup(true);
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {periods.map((period) => (
          <div key={period} className="grid-row">
            <div className="grid-cell period-title">
              <strong>{period}</strong>
              <p className="period-time">{periodTimes[period]}</p>
            </div>

            {days.map((day) => {
              const lesson = schedule[day]?.[period];
              return (
                <div key={day + period} className="grid-cell lesson-cell">
                  {lesson ? (
                    <div className="lesson-box colorful-box">
                      <h4>{lesson.subject}</h4>
                      <p>Room {lesson.room}</p>
                      <p>{lesson.teacher}</p>
                      <span className="class-tag">{lesson.className}</span>
                    </div>
                  ) : (
                    <span className="empty-slot">—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card large">
            <h3>Add Lesson for {selectedDay}</h3>

            <select
              value={newLesson.period}
              onChange={(e) =>
                setNewLesson({ ...newLesson, period: e.target.value })
              }
            >
              <option value="">Select Period</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p} ({periodTimes[p]})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Subject"
              value={newLesson.subject}
              onChange={(e) =>
                setNewLesson({ ...newLesson, subject: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Room"
              value={newLesson.room}
              onChange={(e) =>
                setNewLesson({ ...newLesson, room: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teacher"
              value={newLesson.teacher}
              onChange={(e) =>
                setNewLesson({ ...newLesson, teacher: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Class (e.g., 9-A)"
              value={newLesson.className}
              onChange={(e) =>
                setNewLesson({ ...newLesson, className: e.target.value })
              }
            />

            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddLesson}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

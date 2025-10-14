import React, { useState } from "react";
import "./Schedule.css";
import Header from "../../../components/Header/Header";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    class: "",
    period: "",
  });

  // Dummy data
  const classes = [
    { id: 1, name: "Class A", teacher: "Mr. Smith" },
    { id: 2, name: "Class B", teacher: "Ms. Johnson" },
  ];

  const timetable = [
    { id: 1, period: "Period 1", time: "08:00 - 09:00", class: "Class A" },
    { id: 2, period: "Period 2", time: "09:00 - 10:00", class: "Class B" },
    { id: 3, period: "Period 3", time: "10:15 - 11:15", class: "Class A" },
  ];

  // Filter timetable safely
  const filtered = selectedClass
    ? timetable.filter((t) => t.class === selectedClass)
    : timetable;

  // Safe date formatter
  const formatDate = (date) => {
    try {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Day navigation
  const changeDay = (offset) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  // Create new schedule
  const handleCreate = () => {
    if (!newSchedule.date || !newSchedule.class || !newSchedule.period) {
      alert("Please fill in all fields");
      return;
    }
    alert("✅ New schedule created!");
    setShowPopup(false);
    setNewSchedule({ date: "", class: "", period: "" });
  };

  return (
    <div className="schedule-page">
      <Header />

      <div className="schedule-container">
        <div className="day-swiper fade-in-up">
          <button onClick={() => changeDay(-1)}>←</button>
          <h2>{formatDate(selectedDate)}</h2>
          <button onClick={() => changeDay(1)}>→</button>
        </div>

        <div className="filters-container fade-in-up">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>

          <button className="add-btn" onClick={() => setShowPopup(true)}>
            + Add Schedule
          </button>
        </div>

        <div className="periods-container fade-in-up">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div key={p.id} className="period-card">
                <h4>{p.period}</h4>
                <p>{p.time}</p>
                <span>{p.class}</span>
              </div>
            ))
          ) : (
            <p className="empty-text">No schedules found</p>
          )}
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Add Schedule</h3>

              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, date: e.target.value })
                }
              />

              <select
                value={newSchedule.class}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, class: e.target.value })
                }
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Period (e.g. Period 4)"
                value={newSchedule.period}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, period: e.target.value })
                }
              />

              <div className="popup-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button className="save-btn" onClick={handleCreate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;

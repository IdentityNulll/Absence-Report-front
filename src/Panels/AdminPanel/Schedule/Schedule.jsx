import React, { useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import "./Schedule.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faGraduationCap,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [scheduleData, setScheduleData] = useState([
    {
      id: 1,
      date: "2025-09-25",
      class: "Mathematics A",
      subject: "Algebra",
      time: "08:00 AM - 09:30 AM",
      room: "101",
    },
    {
      id: 2,
      date: "2025-09-25",
      class: "Physics",
      subject: "Mechanics",
      time: "10:00 AM - 11:30 AM",
      room: "203",
    },
    {
      id: 3,
      date: "2025-09-25",
      class: "Chemistry",
      subject: "Organic Chemistry",
      time: "02:00 PM - 03:30 PM",
      room: "205",
    },
    {
      id: 4,
      date: "2025-09-26",
      class: "Advanced Mathematics",
      subject: "Calculus",
      time: "03:00 PM - 04:30 PM",
      room: "102",
    },
    {
      id: 5,
      date: "2025-09-26",
      class: "History",
      subject: "World War II",
      time: "11:00 AM - 12:30 PM",
      room: "201",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    class: "",
    subject: "",
    time: "",
    room: "",
  });

  const filteredData = scheduleData.filter(
    (item) =>
      (!selectedDate || item.date === selectedDate) &&
      (!selectedClass || item.class === selectedClass)
  );

  const handleAddSchedule = () => {
    if (
      !newSchedule.date ||
      !newSchedule.class ||
      !newSchedule.subject ||
      !newSchedule.time ||
      !newSchedule.room
    ) {
      alert("Please fill all fields");
      return;
    }
    setScheduleData([
      ...scheduleData,
      { id: Date.now(), ...newSchedule },
    ]);
    setShowModal(false);
    setNewSchedule({ date: "", class: "", subject: "", time: "", room: "" });
  };

  return (
    <div className="body">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-left">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container fade-in-up">
        <div className="filter-box">
          <label>
            <FontAwesomeIcon icon={faCalendarAlt} /> Select Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <label>
            <FontAwesomeIcon icon={faGraduationCap} /> Select Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="Mathematics A">Mathematics A</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Advanced Mathematics">Advanced Mathematics</option>
            <option value="History">History</option>
          </select>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Schedule
        </button>
      </div>

      {/* Schedule Table */}
      <div className="schedule-container fade-in-up">
        <h3>Class Schedule</h3>
        {filteredData.length > 0 ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.class}</td>
                  <td>{item.subject}</td>
                  <td>{item.time}</td>
                  <td>{item.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results">No schedule found for selected filters.</p>
        )}
      </div>

      {/* Modal for adding schedule */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Schedule</h3>
            <input
              type="date"
              placeholder="Date"
              value={newSchedule.date}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Class"
              value={newSchedule.class}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, class: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Subject"
              value={newSchedule.subject}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, subject: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Time"
              value={newSchedule.time}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, time: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Room"
              value={newSchedule.room}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, room: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleAddSchedule} className="save-btn">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <FontAwesomeIcon icon={faTimes} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;

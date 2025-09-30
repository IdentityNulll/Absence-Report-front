import React, { useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import "./Schedule.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // Mock class schedule data
  const scheduleData = [
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
  ];

  const filteredData = scheduleData.filter(
    (item) =>
      (!selectedDate || item.date === selectedDate) &&
      (!selectedClass || item.class === selectedClass)
  );

  return (
    <body className="body" >
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-left">
            <Sidebar />
          </div>
          <div className="header-profile">{/* <h2>Schedule</h2> */}</div>
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
    </body>
  );
}

export default Schedule;

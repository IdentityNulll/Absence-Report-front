import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import "./Schedule.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faGraduationCap,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    classUuid: "",
    periodUuid: "",
  });

  // Fetch classes and timetable
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, timeRes] = await Promise.all([
          api.get("/class/all"),
          api.get("/timetable/1"), // You can replace 1 with actual ID or fetch all if possible
        ]);

        setClasses(classRes.data || []);
        // timetable might be single or array
        setTimetable(
          Array.isArray(timeRes.data) ? timeRes.data : [timeRes.data]
        );
      } catch (err) {
        console.error("Error fetching schedule data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter by class and date
  const filteredClasses = classes.filter(
    (item) => !selectedClass || item.name === selectedClass
  );

  const handleAddSchedule = () => {
    if (
      !newSchedule.date ||
      !newSchedule.classUuid ||
      !newSchedule.periodUuid
    ) {
      alert("Please fill all fields");
      return;
    }

    // POST to backend (dummy placeholder)
    api
      .post("/class/add", {
        name: newSchedule.classUuid,
        teacher: "Unknown",
        studentCount: 0,
      })
      .then(() => {
        alert("Schedule added!");
        setShowModal(false);
      })
      .catch((err) => console.error("Add schedule failed:", err));
  };

  if (loading) return <p>Loading schedule...</p>;

  return (
    <div className="body">
      <Header />

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
            {classes.map((cls) => (
              <option key={cls.uuid} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Schedule
        </button>
      </div>

      <div className="schedule-container fade-in-up">
        <h3>Class Schedule</h3>
        {filteredClasses.length > 0 ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Time</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.uuid}>
                  <td>{selectedDate || "—"}</td>
                  <td>{cls.name}</td>
                  <td>{cls.teacher}</td>
                  <td>
                    {timetable.length > 0
                      ? `${
                          timetable[0].startTime.hour
                        }:${timetable[0].startTime.minute
                          .toString()
                          .padStart(2, "0")} - ${
                          timetable[0].endTime.hour
                        }:${timetable[0].endTime.minute
                          .toString()
                          .padStart(2, "0")}`
                      : "—"}
                  </td>
                  <td>{cls.studentCount}</td>
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

            <select
              value={newSchedule.classUuid}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, classUuid: e.target.value })
              }
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.uuid} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={newSchedule.periodUuid}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, periodUuid: e.target.value })
              }
            >
              <option value="">Select Period</option>
              {timetable.map((p) => (
                <option key={p.uuid} value={p.uuid}>
                  {p.periodNumber} ({p.startTime.hour}:{p.startTime.minute}–
                  {p.endTime.hour}:{p.endTime.minute})
                </option>
              ))}
            </select>

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

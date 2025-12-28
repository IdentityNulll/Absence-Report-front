import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import api from "../../../api/axios";
import "./OneClass.css";

function OneClass() {
  const { className } = useParams();
  const decodedClass = decodeURIComponent(className);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/attendance/by-classId/${decodedClass}`);
        setStudents(Array.isArray(res.data?.data) ? res.data.data : []);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [decodedClass]);

  if (loading) return <Loader />;

  return (
    <div className="body">
      <Header />
      <div className="oneclass-container fade-in-up">
        <h2>Attendance Report for {decodedClass}</h2>

        {students.length === 0 ? (
          <p>No reported absences or delays.</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item, i) => (
                <tr key={item.studentResponseDto.id}>
                  <td>{i + 1}</td>
                  <td>
                    {item.studentResponseDto.firstName}{" "}
                    {item.studentResponseDto.lastName}
                  </td>
                  <td
                    style={{
                      color:
                        item.reasonType === "ABSENT"
                          ? "red"
                          : item.reasonType === "LATE"
                          ? "orange"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {item.reasonType}
                  </td>
                  <td>{item.reason}</td>
                  <td>{item.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OneClass;

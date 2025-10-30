import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import "./OneClass.css";

function OneClass() {
  const { className } = useParams();
  const decodedClass = decodeURIComponent(className);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      const dummyStudents = [
        {
          id: 1,
          name: "Amina Khan",
          status: "ABSENT",
          comment: "Cannot go becuase of a trip",
        },
        {
          id: 2,
          name: "Kenji Ito",
          status: "LATE",
          comment: "Was 10 minutes late due to traffic.",
        },
        {
          id: 3,
          name: "Sarah Lee",
          status: "ABSENT",
          comment: "Reported sick leave today.",
        },
        {
          id: 4,
          name: "John Doe",
          status: "LATE",
          comment: "Will arrive 30min late, because of family issues",
        },
      ];
      setStudents(dummyStudents);
      setLoading(false);
    }, 800); // simulate loading
  }, [className]);

  if (loading) return <Loader />;

  return (
    <div className="body">
      <Header />
      <div className="oneclass-container fade-in-up">
        <h2>Attendance Report for {decodedClass}</h2>

        {students.length === 0 ? (
          <p>No students found for this class.</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td
                    style={{
                      color:
                        s.status === "PRESENT"
                          ? "green"
                          : s.status === "ABSENT"
                          ? "red"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {s.status}
                  </td>
                  <td>{s.comment}</td>
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

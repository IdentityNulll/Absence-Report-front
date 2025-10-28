import Header from "../../../components/Header/Header";
import "./Stats.css";

export default function Stats() {
  // Dummy data for the day
  const statsData = {
    absent: [
      { name: "John Doe", reason: "Sick" },
      { name: "Sarah Lee", reason: "Family Problems" },
      { name: "Kenji Ito", reason: "Cannot Go" },
    ],
    late: [
      { name: "Amina Khan", reason: "Late" },
      { name: "Daniel Cruz", reason: "Late" },
    ],
  };

  return (
    <div className="stats-wrapper">
      <Header />

      <div className="stats-container fade-in-up">
        <h2>Today's Attendance Report</h2>

        <div className="stats-grid">
          {/* Absent Section */}
          <div className="stats-card">
            <h3>Absent</h3>
            <ul>
              {statsData.absent.map((item, index) => (
                <li key={index}>
                  <span className="name">{item.name}</span>
                  <span
                    className={`reason ${item.reason
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {item.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Late Section */}
          <div className="stats-card">
            <h3>Late</h3>
            <ul>
              {statsData.late.map((item, index) => (
                <li key={index}>
                  <span className="name">{item.name}</span>
                  <span className="reason late">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

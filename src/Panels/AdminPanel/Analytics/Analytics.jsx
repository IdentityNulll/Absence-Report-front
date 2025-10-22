import React, { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Analytics.css";
import Header from "../../../components/Header/Header";

// Line chart data
const data = [
  { date: "Mon", Present: 25, Absent: 2, Sick: 1, Family: 0, Late: 1 },
  { date: "Tue", Present: 27, Absent: 1, Sick: 0, Family: 1, Late: 0 },
  { date: "Wed", Present: 26, Absent: 3, Sick: 1, Family: 0, Late: 2 },
  { date: "Thu", Present: 28, Absent: 0, Sick: 0, Family: 1, Late: 1 },
  { date: "Fri", Present: 24, Absent: 4, Sick: 2, Family: 0, Late: 0 },
];

// Pie chart dummy data
const attendanceSummary = [
  { name: "Present", value: 130 },
  { name: "Absent", value: 10 },
  { name: "Sick", value: 5 },
  { name: "Family", value: 3 },
  { name: "Late", value: 4 },
];

const absenceReasons = [
  { name: "Sick", value: 8 },
  { name: "Family", value: 5 },
  { name: "Other", value: 2 },
];

// Colors for pie slices
const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#9333ea", "#f59e0b"];

// Memoized Line Chart
const AnalyticsChart = memo(() => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Present" stroke="#22c55e" strokeWidth={2} isAnimationActive={false} />
      <Line type="monotone" dataKey="Absent" stroke="#ef4444" strokeWidth={2} isAnimationActive={false} />
      <Line type="monotone" dataKey="Sick" stroke="#3b82f6" strokeWidth={2} isAnimationActive={false} />
      <Line type="monotone" dataKey="Family" stroke="#9333ea" strokeWidth={2} isAnimationActive={false} />
      <Line type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={2} isAnimationActive={false} />
    </LineChart>
  </ResponsiveContainer>
));

// Memoized Pie Chart
const PieCharts = memo(() => (
  <div className="pie-charts">
    <div className="pie-chart-box">
      <h4>Total Attendance Summary</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={attendanceSummary}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {attendanceSummary.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="pie-chart-box">
      <h4>Absence Reasons</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={absenceReasons}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {absenceReasons.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
));

function Analytics() {
  return (
    <div className="body">
      <Header />

      <div className="analytics-container fade-in-up">
        <h3>Attendance Overview</h3>
        <div className="chart-box">
          <AnalyticsChart />
        </div>

        <h3 style={{ marginTop: "2rem" }}>Attendance Breakdown</h3>
        <PieCharts />
      </div>
    </div>
  );
}

export default Analytics;

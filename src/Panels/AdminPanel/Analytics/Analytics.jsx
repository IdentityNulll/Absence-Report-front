import React, { memo } from "react";
import Sidebar from "../../../components/SideBar/SibeBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";
import Header from "../../../components/Header/Header";

const data = [
  { date: "Mon", Present: 25, Absent: 2, Sick: 1, Family: 0, Late: 1 },
  { date: "Tue", Present: 27, Absent: 1, Sick: 0, Family: 1, Late: 0 },
  { date: "Wed", Present: 26, Absent: 3, Sick: 1, Family: 0, Late: 2 },
  { date: "Thu", Present: 28, Absent: 0, Sick: 0, Family: 1, Late: 1 },
  { date: "Fri", Present: 24, Absent: 4, Sick: 2, Family: 0, Late: 0 },
];

// Memoized chart so it doesn’t rerender unnecessarily
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

function Analytics() {
  return (
    <div className="body">
      <Header/>

      <div className="analytics-container fade-in-up">
        <h3>Attendance Overview</h3>
        <div className="chart-box">
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
}

export default Analytics;

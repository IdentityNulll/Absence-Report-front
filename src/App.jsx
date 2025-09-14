import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./Panels/AdminPanel/Dashboard/Dashboard.jsx";
import Class from "./Panels/AdminPanel/Classes/Class.jsx";
import Profile from "./Panels/AdminPanel/Profile/Profile.jsx";
import Schedule from "./Panels/AdminPanel/Schedule/Schedule.jsx";
import ProtectedRoute from "./components/SideBar/ProtectedRoute.jsx";
import "./App.css"
import { ThemeProvider } from "./context/Theme.context.jsx";
import "./styles/Theme.css"

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/class"
          element={
            <ProtectedRoute>
              <Class />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

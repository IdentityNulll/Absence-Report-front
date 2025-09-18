import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./Panels/AdminPanel/Dashboard/Dashboard.jsx";
import Profile from "./Panels/AdminPanel/Profile/Profile.jsx";
import Schedule from "./Panels/AdminPanel/Schedule/Schedule.jsx";
import Analytics from "./Panels/AdminPanel/Analytics/Analytics.jsx";
import Notifications from "./Panels/AdminPanel/Notifications/Notifications.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";
import { ThemeProvider } from "./context/Theme.context.jsx";
import "./styles/Theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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
            path="/admin/notifications"
            element={
              <ProtectedRoute>
                <Notifications/>
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
          <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics/>
            </ProtectedRoute>
          }/>
        </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

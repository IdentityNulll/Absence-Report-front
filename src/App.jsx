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
import Layout from "./components/Layout.jsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";
import AdminAnimate from "./components/Animation/AdminAnimate.jsx";
import ChangePassword from "./components/changePassword/ChangePassword.jsx";
import ManageUsers from "./Panels/AdminPanel/manangeUsers/ManageUsers.jsx";
import Stats from "./Panels/AdminPanel/stats/Stats.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <ThemeProvider>
        <AdminAnimate />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
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
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
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
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/changepassword"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manageusers"
              element={
                <ProtectedRoute>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute>
                  <Stats/>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

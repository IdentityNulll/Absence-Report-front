import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error("Please fill out all fields");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-box">
        <h2>Change Password</h2>
        <p className="forgot-subtext">
          Enter your old password and set a new one below.
        </p>

        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old password"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />

        <button onClick={handleChangePassword} disabled={loading}>
          {loading ? "Saving..." : "Change Password"}
        </button>

        <p className="forgot-link">
          Don’t know your old password?{" "}
          <Link to="/admin/forgot-password">Reset here</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

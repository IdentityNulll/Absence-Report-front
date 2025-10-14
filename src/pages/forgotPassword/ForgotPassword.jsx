import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const res = await api.put(`/auth/forgetPassword?email=${email}`);
      toast.success(res.data.message || "Verification code sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return toast.error("Enter the verification code");
    setLoading(true);
    try {
      const res = await api.put("/auth/check-forget-password", {
        mail: email,
        code: parseInt(code),
      });
      toast.success(res.data.message || "Code verified!");
      setStep(3);
    } catch {
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (!newPassword) return toast.error("Enter a new password");
    setLoading(true);
    try {
      const res = await api.put("/auth/set-new-password", {
        mail: email,
        password: newPassword,
      });
      toast.success(res.data.message || "Password successfully changed!");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-box">
        <h2>Reset Password</h2>
        <p className="forgot-subtext">
          {step === 1 && "Enter your email to receive a verification code."}
          {step === 2 && "Enter the verification code sent to your email."}
          {step === 3 && "Enter your new password to complete reset."}
        </p>

        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button onClick={handleSendCode} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
            />
            <button onClick={handleVerifyCode} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button onClick={handleSetNewPassword} disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

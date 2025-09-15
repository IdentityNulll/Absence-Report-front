import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useEffect } from "react";
import { faEye, faUser, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/Theme.context";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import "aos/dist/aos.css";
import AOS from "aos";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // whether animation should happen only once
    });
  }, []);

  const fakeUsers = [
    { email: "admin@test.com", password: "admin123", role: "admin" },
    { email: "teacher@test.com", password: "teacher123", role: "teacher" },
    { email: "student@test.com", password: "student123", role: "student" },
  ];

  const { theme, toggleTheme } = useTheme();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // save token (mocked)
      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("role", user.role);

      // redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }

      Toastify({
        text: `Welcome, ${
          user.role.charAt(0).toUpperCase() + user.role.slice(1)
        }! 🎉`,
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          fontWeight: "bold",
          fontSize: "16px",
        },
      }).showToast();
    } else {
      Toastify({
        text: "Invalid email or password",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          fontWeight: "bold",
        },
        callback: () => {
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 300]);
          }
        },
      }).showToast();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [navigate]);

  return (
    <div>
      <div className="theme" >
        <ThemeSwitcher />
      </div>
      <div className="login-page">
        <spline-viewer
          loading-anim-type="spinner-small-dark"
          url="https://prod.spline.design/bfRXgsB4kicyhWHU/scene.splinecode"
          style={{ width: "50%", height: "700px" }}
          data-aos="fade-right"
        >
        </spline-viewer>
          <div className="smth"></div>

        {/* Login Form */}
        <div className="container" data-aos="fade-left">
          <form onSubmit={handleLogin} className="login-form">
            <h4 className="title">{t("login.title")}</h4>
            <div className="inputs-container">
              <div className="input-container">
                <input
                  type="email"
                  placeholder={t("login.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <button type="submit" className="login-btn">
              {t("login.button")}
              <FontAwesomeIcon icon={faRocket} />
            </button>
          </form>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/Theme.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ThemeSwichter from "../../components/ThemeSwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { GoogleLogin } from "@react-oauth/google";
import * as jwt_decode from "jwt-decode";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const fakeUsers = [
    { email: "admin@test.com", password: "admin123", role: "admin" },
    { email: "teacher@test.com", password: "teacher123", role: "teacher" },
    { email: "student@test.com", password: "student123", role: "student" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [navigate]);

  // ✅ Google login handlers OUTSIDE of handleLogin
  const handleGoogleSuccess = (credentialResponse) => {
    const handleGoogleSuccess = (credentialResponse) => {
      const decoded = jwt_decode.default(credentialResponse.credential);
      const googleEmail = decoded.email;
    };

    const user = fakeUsers.find((u) => u.email === googleEmail);
    if (user) {
      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("role", user.role);

      navigate(`/${user.role}/dashboard`);
      toast.success("Logged in with Google!");
    } else {
      toast.error("No account found with this Google email");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed, try again!");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("role", user.role);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }

      toast.success("Successfully Passed Please Wait");
    } else {
      toast.error("Your email or password is wrong try again please");
    }
  };

  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div className="switchers">
        <ThemeSwichter />
        <LanguageSwitcher />
      </div>
      <div className="container">
        <div className="title">
          <FontAwesomeIcon
            icon={faGraduationCap}
            style={{
              background: "oklch(0.488 0.243 264.376)",
              padding: "15px",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <h3>{t("login.title")}</h3>
          <p>{t("login.title-small")}</p>
        </div>
        <form onSubmit={handleLogin} className="form-container">
          <div className="input-container">
            <label htmlFor="email">{t("login.email-label")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("login.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">{t("login.password-label")}</label>
            <div className="icon">
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
          <p className="forgot">Forgot Password?</p>
          <button type="submit" className="login-btn">
            Sign In
          </button>
          <div class="line-with-text">
            <span>OR</span>
          </div>  
        </form>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;

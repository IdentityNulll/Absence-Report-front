import React, { useState, useEffect } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/Theme.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import api from "../../api/axios";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        mail: email,
        password,
      });

      const { data, message } = response.data;
      console.log(response.data);
      const currentUserId = data?.currentUserId;

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.currentUserId);
        toast.success("Login successful! Please wait...");
        localStorage.setItem("id", currentUserId);
        setTimeout(() => {
          if (localStorage.getItem("token")) {
            navigate("/admin/dashboard");
          }
        }, 800);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Incorrect email or password.");
    }
  };

  const { theme } = useTheme();

  return (
    <>
      <div className="login-page">
        <form className="login-card" data-aos="fade-up">
          <div className="title" data-aos="fade-down">
            <FontAwesomeIcon icon={faGraduationCap} className="logo-icon" />
            <h3>{t("login.title")}</h3>
            <p>{t("login.title-small")}</p>
          </div>

          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!forgotMode && (
            <>
              <div className="input-container">
                <label>Password</label>
                <div className="icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
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

              <Link to={"/admin/forgot-password"} className="forgot" >
                Forgot Password?
              </Link>

              <button type="submit" className="login-btn" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
        </form>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;

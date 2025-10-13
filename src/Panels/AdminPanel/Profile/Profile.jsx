import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faGraduationCap,
  faUsers,
  faUserShield,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "./Profile.css";

export default function Profile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageType, setManageType] = useState(""); // teacher, student, admin
  const [list, setList] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    mail: "",
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem("id");
        if (!id) return;
        const res = await api.get(`/admin/${id}`);
        setAdminData(res.data.data);
        setEmail(res.data.data.mail);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // Handle password reset flow
  const handleSendCode = async () => {
    if (!email) return toast.error("Email required");
    try {
      const res = await api.put(`/auth/forgetPassword?email=${email}`);
      toast.success(res.data.message || "Code sent");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending code");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return toast.error("Code required");
    try {
      const res = await api.put("/auth/check-forget-password", {
        mail: email,
        code: parseInt(code),
      });
      toast.success(res.data.message || "Code verified");
      setStep(3);
    } catch {
      toast.error("Invalid code");
    }
  };

  const handleSetNewPassword = async () => {
    if (!newPassword) return toast.error("Password required");
    try {
      const res = await api.put("/auth/set-new-password", {
        mail: email,
        password: newPassword,
      });
      toast.success(res.data.message || "Password changed");
      setShowPasswordModal(false);
      setStep(1);
      setCode("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update");
    }
  };

  // Fetch users for each category
  const openManageModal = async (type) => {
    setManageType(type);
    setShowManageModal(true);
    try {
      let res;
      if (type === "teachers") res = await api.get("/teachers");
      if (type === "students") res = await api.get("/student");
      if (type === "admins") res = await api.get("/admin");
      setList(res.data.data || res.data);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.mail)
      return toast.error("All fields required");
    try {
      if (manageType === "teachers") await api.post("/teachers", newUser);
      if (manageType === "students") await api.post("/student", newUser);
      if (manageType === "admins") await api.post("/admin", newUser);

      toast.success("User added!");
      setNewUser({ firstName: "", lastName: "", mail: "" });
      openManageModal(manageType); // Refresh list
    } catch {
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="profile-wrapper">
      <Header />
      <div className="profile-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-content">
            <div className="profile-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <h2>
              {adminData?.firstName} {adminData?.lastName}
            </h2>
            <p className="profile-role">{adminData?.role}</p>
            <p className="profile-email">{adminData?.mail}</p>
            <button
              className="btn-primary"
              onClick={() => setShowPasswordModal(true)}
            >
              <FontAwesomeIcon icon={faLock} /> Change Password
            </button>
          </div>
        )}

        <div className="manage-section">
          <h3>Manage Roles</h3>
          <div className="manage-buttons">
            <button
              className="btn-secondary"
              onClick={() => openManageModal("teachers")}
            >
              <FontAwesomeIcon icon={faGraduationCap} /> Teachers
            </button>
            <button
              className="btn-secondary"
              onClick={() => openManageModal("students")}
            >
              <FontAwesomeIcon icon={faUsers} /> Students
            </button>
            <button
              className="btn-secondary"
              onClick={() => openManageModal("admins")}
            >
              <FontAwesomeIcon icon={faUserShield} /> Admins
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-box small">
            <h3>Reset Password</h3>
            {step === 1 && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <button onClick={handleSendCode} className="btn-primary">
                  Send Code
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
                <button onClick={handleVerifyCode} className="btn-primary">
                  Verify Code
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
                <button onClick={handleSetNewPassword} className="btn-primary">
                  Save Password
                </button>
              </>
            )}
            <button
              className="btn-cancel"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showManageModal && (
        <div className="modal">
          <div className="modal-box large">
            <div className="modal-header">
              <h3>
                Manage{" "}
                {manageType.charAt(0).toUpperCase() + manageType.slice(1)}
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowManageModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-user-form">
              <input
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
              />
              <input
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
              />
              <input
                placeholder="Email"
                value={newUser.mail}
                onChange={(e) =>
                  setNewUser({ ...newUser, mail: e.target.value })
                }
              />
              <input
                type="date"
                value={newUser.birthday || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, birthday: e.target.value })
                }
              />
              <select
                value={newUser.role || "STUDENT"}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={newUser.password || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <button onClick={handleAddUser} className="btn-primary">
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>

            <div className="user-list">
              {list.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <ul>
                  {list.map((item, i) => (
                    <li key={i}>
                      {item.firstName} {item.lastName} — {item.mail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

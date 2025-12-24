import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUsers,
  faUserShield,
  faSchool,
  faPlus,
  faChevronDown,
  faTimes,
  faTrash,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import "./ManagaUsers.css";

export default function ManageUsers() {
  const [selectedType, setSelectedType] = useState(null);
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [classList, setClassList] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    birthday: "",
    role: "STUDENT",
    password: "",
    classId: "",
    name: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Fetch list by type
  const fetchList = async (type) => {
    try {
      let res;
      if (type === "teachers") {
        res = await api.get("teachers");
        setList(res.data.data || res.data);
      } else if (type === "students") {
        res = await api.get("student");
        setList(res.data.data || res.data);
      } else if (type === "admins") {
        res = await api.get("admin");
        setList(res.data.data || res.data);
      } else if (type === "classes") {
        res = await api.get("class/all");
        setList(res.data.data || res.data);
      }
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get("class/all");
      setClassList(res.data.data || res.data);
    } catch {
      toast.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelect = (type) => {
    if (selectedType === type) {
      setSelectedType(null);
      setList([]);
    } else {
      setSelectedType(type);
      fetchList(type);
    }
  };

  const handleAddUser = async () => {
    try {
      if (selectedType === "classes") {
        if (!newUser.name) return toast.error("Class name required");
        await api.post("class/add", { name: newUser.name });
        toast.success("Class added!");
        setNewUser({
          firstName: "",
          lastName: "",
          mail: "",
          birthday: "",
          role: "STUDENT",
          password: "",
          classId: "",
          name: "",
        });
        fetchList("classes");
        setShowModal(false);
        return;
      }

      if (!newUser.firstName || !newUser.lastName || !newUser.mail)
        return toast.error("All fields required");

      if (selectedType === "teachers") await api.post("teachers", newUser);
      if (selectedType === "students") {
        if (!newUser.classId) return toast.error("Select class");
        await api.post("student", newUser);
      }
      if (selectedType === "admins") await api.post("admin", newUser);

      toast.success("User added!");
      setShowModal(false);
      fetchList(selectedType);
    } catch {
      toast.error("Failed to add user");
    }
  };

  // ✅ Delete user/class
  const handleDelete = async (id) => {
    if (!selectedType) return;
    let endpoint = "";

    if (selectedType === "teachers") endpoint = `/teachers/${id}`;
    if (selectedType === "students") endpoint = `/student/${id}`;
    if (selectedType === "admins") endpoint = `/admin/${id}`;
    if (selectedType === "classes") endpoint = `/class/${id}`;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(endpoint);
      toast.success("Deleted successfully!");
      fetchList(selectedType);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ✅ Show user details modal
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const userTypes = [
    { type: "students", label: "Students", icon: faUsers },
    { type: "teachers", label: "Teachers", icon: faGraduationCap },
    { type: "admins", label: "Admins", icon: faUserShield },
    { type: "classes", label: "Classes", icon: faSchool },
  ];

  return (
    <div className="manage-users-wrapper">
      <Header />
      <div className="manage-users-container fade-in-up">
        <h2>Manage Users</h2>

        {userTypes.map(({ type, label, icon }) => (
          <div key={type} className="user-section">
            <button
              className={`user-type-btn ${
                selectedType === type ? "active" : ""
              }`}
              onClick={() => handleSelect(type)}
            >
              <span>
                <FontAwesomeIcon icon={icon} /> {label}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`arrow ${selectedType === type ? "rotated" : ""}`}
              />
            </button>

            {selectedType === type && (
              <div className="user-list-section">
                <div className="user-list-header">
                  <h3>{label} List</h3>
                  <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Create
                  </button>
                </div>

                <div className="user-list">
                  <ul>
                    {list.map((item, i) => (
                      <li
                        key={i}
                        className="user-item"
                        onClick={() => handleUserClick(item)}
                      >
                        <div className="user-info">
                          {selectedType === "classes" ? (
                            <>{item.name}</>
                          ) : (
                            <>
                              {item.firstName} {item.lastName} —{" "}
                              {item.mail || item.email}
                            </>
                          )}
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id || item.uuid)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New {selectedType?.slice(0, -1)}</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="add-user-form">
                {selectedType === "classes" ? (
                  <>
                    <input
                      placeholder="Class Name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
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
                      value={newUser.birthday}
                      onChange={(e) =>
                        setNewUser({ ...newUser, birthday: e.target.value })
                      }
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    {newUser.role === "STUDENT" && (
                      <select
                        value={newUser.classId}
                        onChange={(e) =>
                          setNewUser({ ...newUser, classId: e.target.value })
                        }
                      >
                        <option value="">Select Class</option>
                        {classList.map((cls) => (
                          <option key={cls.uuid} value={cls.uuid}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      type="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </>
                )}
                <button onClick={handleAddUser} className="btn-primary">
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Modal for showing user details */}
        {showUserModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>User Details</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowUserModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="user-details">
                {selectedType === "classes" ? (
                  <p>
                    <b>Class Name:</b> {selectedUser.name}
                  </p>
                ) : (
                  <>
                    <p>
                      <b>First Name:</b> {selectedUser.firstName}
                    </p>
                    <p>
                      <b>Last Name:</b> {selectedUser.lastName}
                    </p>
                    <p>
                      <b>Email:</b> {selectedUser.mail || selectedUser.email}
                    </p>
                    {selectedUser.birthday && (
                      <p>
                        <b>Birthday:</b> {selectedUser.birthday}
                      </p>
                    )}
                    {selectedUser.role && (
                      <p>
                        <b>Role:</b> {selectedUser.role}
                      </p>
                    )}
                    <div className="password-row">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={selectedUser.password || "************"}
                        readOnly
                      />
                      <button
                        className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

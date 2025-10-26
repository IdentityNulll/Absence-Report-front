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
  });
  const fetchList = async (type) => {
    try {
      let res;
      if (type === "teachers") {
        res = await api.get("teachers");
        const teachers = res.data.data.map((t) => ({
          firstName: t.firstName,
          lastName: t.lastName,
          mail: t.email, // fix
        }));
        setList(teachers);
        return;
      }

      if (type === "students") {
        res = await api.get("student");
        setList(res.data.data || res.data);
        return;
      }

      if (type === "admins") {
        res = await api.get("admin");
        setList(res.data.data || res.data);
        return;
      }

      if (type === "classes") {
        res = await api.get("class/all");
        setList(res.data.data || res.data);
        return;
      }
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  // ✅ Fetch all classes for student dropdown
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
      return;
    }
    setSelectedType(type);
    fetchList(type);
  };

  // ✅ Add user function
  const handleAddUser = async () => {
    // check for class creation separately
    if (selectedType === "classes") {
      if (!newUser.name) return toast.error("Class name is required");
      try {
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
      } catch {
        toast.error("Failed to add class");
      }
      return;
    }

    // validate for users
    if (!newUser.firstName || !newUser.lastName || !newUser.mail)
      return toast.error("All fields required");

    try {
      if (selectedType === "teachers") await api.post("teachers", newUser);
      if (selectedType === "students") {
        if (!newUser.classId) return toast.error("Please select a class");
        await api.post("student", newUser);
      }
      if (selectedType === "admins") await api.post("admin", newUser);

      toast.success("User added!");
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
      fetchList(selectedType);
      setShowModal(false);
    } catch {
      toast.error("Failed to add user");
    }
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
                        onClick={(e) => {
                          // Disable "open" toggle for classes
                          if (selectedType !== "classes") {
                            e.currentTarget.classList.toggle("open");
                          }
                        }}
                      >
                        {selectedType === "classes" ? (
                          <>{item.name}</>
                        ) : (
                          <>
                            {item.firstName} {item.lastName} — {item.mail}
                            <div className="details">
                              <p>
                                <b>Birthday:</b> {item.birthday || "N/A"}
                              </p>
                              <p>
                                <b>Role:</b>{" "}
                                {item.role || selectedType.slice(0, -1)}
                              </p>
                            </div>
                          </>
                        )}
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
                      value={newUser.name || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                    <button onClick={handleAddUser} className="btn-primary">
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
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
                    <button onClick={handleAddUser} className="btn-primary">
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
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

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUsers,
  faUserShield,
  faSchool,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import "./ManagaUsers.css";

export default function ManageUsers() {
  const [selectedType, setSelectedType] = useState(null); // teachers, students, admins, classes
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    birthday: "",
    role: "STUDENT",
    password: "",
  });

  const fetchList = async (type) => {
    try {
      let res;
      if (type === "teachers") res = await api.get("/teachers");
      if (type === "students") res = await api.get("/student");
      if (type === "admins") res = await api.get("/admin");
      if (type === "classes") res = await api.get("/classes"); // you can update this when you have a real endpoint
      setList(res.data.data || res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const handleSelect = (type) => {
    setSelectedType(type);
    fetchList(type);
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.mail)
      return toast.error("All fields required");

    try {
      if (selectedType === "teachers") await api.post("/teachers", newUser);
      if (selectedType === "students") await api.post("/student", newUser);
      if (selectedType === "admins") await api.post("/admin", newUser);
      toast.success("User added!");
      setNewUser({
        firstName: "",
        lastName: "",
        mail: "",
        birthday: "",
        role: "STUDENT",
        password: "",
      });
      fetchList(selectedType);
      setShowModal(false);
    } catch {
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="manage-users-wrapper">
      <Header />
      <div className="manage-users-container fade-in-up">
        <h2>Manage Users</h2>

        <div className="user-type-buttons">
          <button onClick={() => handleSelect("students")}>
            <FontAwesomeIcon icon={faUsers} /> Students
          </button>
          <button onClick={() => handleSelect("teachers")}>
            <FontAwesomeIcon icon={faGraduationCap} /> Teachers
          </button>
          <button onClick={() => handleSelect("admins")}>
            <FontAwesomeIcon icon={faUserShield} /> Admins
          </button>
          <button onClick={() => handleSelect("classes")}>
            <FontAwesomeIcon icon={faSchool} /> Classes
          </button>
        </div>

        {selectedType && (
          <div className="user-list-section">
            <div className="user-list-header">
              <h3>
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
                List
              </h3>
              <button
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} /> Create
              </button>
            </div>

            <div className="user-list">
              {list.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <ul>
                  {list.map((item, i) => (
                    <li
                      key={i}
                      onClick={(e) => e.currentTarget.classList.toggle("open")}
                    >
                      {item.firstName} {item.lastName} — {item.mail}
                      <div className="details">
                        <p>
                          <b>Birthday:</b> {item.birthday || "N/A"}
                        </p>
                        <p>
                          <b>Role:</b> {item.role}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-box large">
            <div className="modal-header">
              <h3>Add New {selectedType?.slice(0, -1)}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

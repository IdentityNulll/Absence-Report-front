import { useEffect, useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import Header from "../../../components/Header/Header";
import "./ManagaUsers.css";

const USER_TYPES = [
  { type: "students", label: "Students", icon: faUsers },
  { type: "teachers", label: "Teachers", icon: faGraduationCap },
  { type: "admins", label: "Admins", icon: faUserShield },
  { type: "classes", label: "Classes", icon: faSchool },
];

const EMPTY_USER = {
  firstName: "",
  lastName: "",
  mail: "",
  birthday: "",
  role: "STUDENT",
  password: "",
  classId: "",
  name: "",
};

export default function ManageUsers() {
  const [selectedType, setSelectedType] = useState(null);
  const [list, setList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await api.get("/class/all");
    setClassList(res.data?.data || res.data || []);
  };

  const fetchList = async (type) => {
    const endpoints = {
      teachers: "/teachers",
      students: "/student",
      admins: "/admin",
      classes: "/class/all",
    };

    try {
      const res = await api.get(endpoints[type]);
      setList(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const handleSelect = (type) => {
    if (selectedType === type) {
      setSelectedType(null);
      setList([]);
      return;
    }
    setSelectedType(type);
    fetchList(type);
  };

  const handleAdd = async () => {
    try {
      if (selectedType === "classes") {
        if (!newUser.name) return toast.error("Class name required");
        await api.post("/class/add", { name: newUser.name });
      } else {
        if (!newUser.firstName || !newUser.lastName || !newUser.mail)
          return toast.error("All fields required");

        if (selectedType === "students" && !newUser.classId)
          return toast.error("Select class");

        const endpoints = {
          teachers: "/teachers",
          students: "/student",
          admins: "/admin",
        };

        await api.post(endpoints[selectedType], newUser);
      }

      toast.success("Created successfully");
      setShowModal(false);
      setNewUser(EMPTY_USER);
      fetchList(selectedType);
    } catch {
      toast.error("Creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    const endpoints = {
      teachers: `/teachers/${id}`,
      students: `/student/${id}`,
      admins: `/admin/${id}`,
      classes: `/class/${id}`,
    };

    try {
      await api.delete(endpoints[selectedType]);
      fetchList(selectedType);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="manage-users-wrapper">
      <Header />

      <section className="manage-users-container">
        <h1>Manage Users</h1>

        {USER_TYPES.map(({ type, label, icon }) => (
          <div key={type} className="user-section">
            <button
              className={`user-type-btn ${
                selectedType === type ? "active" : ""
              }`}
              onClick={() => handleSelect(type)}
              aria-expanded={selectedType === type}
            >
              <span>
                <FontAwesomeIcon icon={icon} /> {label}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`arrow ${
                  selectedType === type ? "rotated" : ""
                }`}
              />
            </button>

            {selectedType === type && (
              <div className="user-list-section">
                <div className="user-list-header">
                  <h2>{label}</h2>
                  <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Create
                  </button>
                </div>

                <ul className="user-list">
                  {list.map((item) => (
                    <li
                      key={item.id || item.uuid}
                      className="user-item"
                      onClick={() => setSelectedItem(item)}
                    >
                      <span className="user-info">
                        {type === "classes"
                          ? item.name
                          : `${item.firstName} ${item.lastName} — ${
                              item.mail || item.email
                            }`}
                      </span>

                      <button
                        className="delete-btn"
                        aria-label="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id || item.uuid);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <header className="modal-header">
              <h2>Create {selectedType?.slice(0, -1)}</h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </header>

            <div className="add-user-form">
              {selectedType === "classes" ? (
                <input
                  placeholder="Class name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              ) : (
                <>
                  <input
                    placeholder="First name"
                    value={newUser.firstName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, firstName: e.target.value })
                    }
                  />
                  <input
                    placeholder="Last name"
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

                  {selectedType === "students" && (
                    <select
                      value={newUser.classId}
                      onChange={(e) =>
                        setNewUser({ ...newUser, classId: e.target.value })
                      }
                    >
                      <option value="">Select class</option>
                      {classList.map((c) => (
                        <option key={c.uuid} value={c.uuid}>
                          {c.name}
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

              <button className="btn-primary" onClick={handleAdd}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

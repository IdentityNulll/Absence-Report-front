import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faGraduationCap,
  faUsers,
  faUserShield,
  faCamera
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "./Profile.css";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";
import ManageUsers from "../manangeUsers/ManageUsers";
export default function Profile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageType, setManageType] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem("id");
        if (!id) return;
        const res = await api.get(`/admin/${id}`);
        setAdminData(res.data.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // preview image on select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImg(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const openManageModal = (type) => {
    setManageType(type);
    setShowManageModal(true);
  };

  return (
    <div className="profile-wrapper">
      <Header />
      <div className="profile">
        <div className="profile-container">
          {loading ? (
            <Loader />
          ) : (
            <div className="profile-content">
              <div className="profile-avatar-container">
                <label htmlFor="profile-upload" className="profile-avatar">
                  {preview ? (
                    <img src={preview} alt="profile" className="avatar-img" />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="default-avatar" />
                  )}
                  <div className="camera-icon">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              <h2>
                {adminData?.firstName} {adminData?.lastName}
              </h2>
              <p className="profile-role">{adminData?.role}</p>
              <p className="profile-email">{adminData?.mail}</p>
              <Link to={"/admin/changepassword"} className="btn-primary">
                <FontAwesomeIcon icon={faLock} /> Change Password
              </Link>
            </div>
          )}
        </div>
      </div>

      {showManageModal && (
        <ManageUsers
          manageType={manageType}
          closeModal={() => setShowManageModal(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
}

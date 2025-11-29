import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const res = await api.get(`/admin/${id}`);
        let admin = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;

        if (admin.photoUrl) {
          // Fetch image with token
          const imageRes = await api.get(admin.photoUrl, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
          });

          // Convert blob to object URL
          admin.photoUrl = URL.createObjectURL(imageRes.data);
        } else {
          admin.photoUrl = null;
        }

        setAdminData(admin);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImg(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const uploadPhoto = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      const formData = new FormData();
      formData.append("file", profileImg);

      let res;
      if (adminData?.photoUrl == null) {
        // No photo yet → POST
        res = await api.post(`/user-photo/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Photo exists → PUT
        res = await api.put(`/user-photo/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Uploaded:", res.data);

      // Update preview & adminData with new image
      const imageRes = await api.get(`/user-photo/${userId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const imageURL = URL.createObjectURL(imageRes.data);
      setAdminData((prev) => ({ ...prev, photoUrl: imageURL }));
      setPreview(null); // reset preview
      toast.success("Photo updated!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    }
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
              {/* PROFILE PHOTO UPLOAD */}
              <div className="profile-avatar-container">
                <label htmlFor="profile-upload" className="profile-avatar">
                  {preview ? (
                    <img src={preview} alt="preview" className="avatar-img" />
                  ) : adminData?.photoUrl ? (
                    <img
                      src={adminData.photoUrl}
                      alt="profile"
                      className="avatar-img"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="default" />
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

              {profileImg && (
                <button onClick={uploadPhoto} className="btn-primary mt-2">
                  Upload Photo
                </button>
              )}

              {/* USER INFO */}
              <h2>
                {adminData?.firstName} {adminData?.lastName}
              </h2>

              <div className="profile-info-box">
                <span className="label">Birthday:</span>
                <span>{adminData?.birthday}</span>
              </div>

              <div className="profile-info-box">
                <span className="label">Email:</span>
                <span>{adminData?.mail}</span>
              </div>

              <div className="profile-info-box">
                <span className="label">Role:</span>
                <span>{adminData?.role}</span>
              </div>

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

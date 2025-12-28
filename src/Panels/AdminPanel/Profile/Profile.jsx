import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "./Profile.css";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";

export default function Profile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const res = await api.get(`/admin/${id}`);
        const admin = res.data?.data;

        if (admin?.photoUrl) {
          const imageRes = await api.get(admin.photoUrl, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
          });

          admin.photoUrl = URL.createObjectURL(imageRes.data);
        } else {
          admin.photoUrl = null;
        }

        setAdminData(admin);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImg(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      const formData = new FormData();
      formData.append("file", profileImg);

      const method = adminData?.photoUrl ? "put" : "post";

      await api[method](`/user-photo/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imageRes = await api.get(`/user-photo/${userId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const imageURL = URL.createObjectURL(imageRes.data);

      setAdminData((prev) => ({ ...prev, photoUrl: imageURL }));
      setProfileImg(null);
      setPreview(null);

      toast.success("Photo updated");
    } catch {
      toast.error("Failed to upload photo");
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="profile-wrapper">
      <Header />

      <section className="profile">
        <div className="profile-content">
          <div className="profile-avatar-container">
            <label
              htmlFor="profile-upload"
              className="profile-avatar"
              aria-label="Change profile photo"
            >
              {preview ? (
                <img src={preview} alt="Profile preview" />
              ) : adminData?.photoUrl ? (
                <img src={adminData.photoUrl} alt="Profile" />
              ) : (
                <FontAwesomeIcon icon={faUser} aria-hidden="true" />
              )}

              <span className="camera-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faCamera} />
              </span>
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          {profileImg && (
            <button className="btn-primary" onClick={uploadPhoto}>
              Upload Photo
            </button>
          )}

          <h1>
            {adminData?.firstName} {adminData?.lastName}
          </h1>

          <div className="profile-info-box">
            <span className="label">Birthday</span>
            <span>{adminData?.birthday}</span>
          </div>

          <div className="profile-info-box">
            <span className="label">Email</span>
            <span>{adminData?.mail}</span>
          </div>

          <div className="profile-info-box">
            <span className="label">Role</span>
            <span>{adminData?.role}</span>
          </div>

          <Link to="/admin/changepassword" className="btn-primary">
            <FontAwesomeIcon icon={faLock} aria-hidden="true" /> Change Password
          </Link>
        </div>
      </section>

      <ToastContainer />
    </main>
  );
}

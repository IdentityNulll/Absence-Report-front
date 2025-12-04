import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../SideBar/SibeBar";
import api from "../../api/axios";
import "./Header.css";

export default function Header() {
  const [profileUrl, setProfileUrl] = useState(
    localStorage.getItem("profileUrl") || null
  );
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("adminInfo")) || null
  );

  useEffect(() => {
    if (profileUrl && admin) return;

    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const res = await api.get(`/admin/${id}`);
        const data = res.data?.data;

        setAdmin(data);
        localStorage.setItem("adminInfo", JSON.stringify(data));

        if (data.photoUrl) {
          const imageRes = await api.get(data.photoUrl, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
          });

          const url = URL.createObjectURL(imageRes.data);
          setProfileUrl(url);
          localStorage.setItem("profileUrl", url);
        }
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      }
    };

    fetchAdmin();
  }, []); // empty deps = runs only once

  return (
    <header className="admin-header">
      <div className="header-left">
        <Sidebar />
      </div>

      <div className="header-right">
        <Link to="/admin/notifications" className="notification">
          <FontAwesomeIcon icon={faBell} />
          <sup>1</sup>
        </Link>

        <Link to="/admin/profile" className="logo-img header-avatar">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt="profile"
              className="header-profile-img"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            admin?.firstName?.charAt(0)?.toUpperCase() || "?"
          )}
        </Link>
      </div>
    </header>
  );
}

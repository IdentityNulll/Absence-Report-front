import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../SideBar/SibeBar";
import "./Header.css";

export default function Header({ adminData }) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <Sidebar />
      </div>

      <div className="header-right">
        <Link to="/admin/notifications" className="notification">
          <FontAwesomeIcon icon={faBell} />
          <sup>8</sup>
        </Link>

        <Link to="/admin/profile" className="logo-img">
          {adminData ? adminData.firstName?.[0]?.toUpperCase() : "S"}
        </Link>
      </div>
    </header>
  );
}

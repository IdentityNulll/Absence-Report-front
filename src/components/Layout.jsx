import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "./loader/Loader";

export default function Layout() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Outlet />
    </>
  );
}

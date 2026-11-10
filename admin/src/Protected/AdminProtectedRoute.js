import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
// import { useAuth } from "../../Authhelper/useAuth"

function AdminProtectedRoute() {

  const token = localStorage.getItem("token");
  // console.log("Token:  ", token);
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminProtectedRoute
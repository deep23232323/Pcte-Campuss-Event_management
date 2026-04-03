// src/routes/AdminRoute.js
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // if no token OR not admin → redirect
  if (!token || !user == "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;

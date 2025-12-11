import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is admin trying to access student routes, redirect to admin
  if (user.role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }
  
  // If user is student trying to access admin routes, redirect to dashboard
  if (user.role === "student" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;





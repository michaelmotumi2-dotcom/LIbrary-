import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
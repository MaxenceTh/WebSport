import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthenticationContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // ou un spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.roleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

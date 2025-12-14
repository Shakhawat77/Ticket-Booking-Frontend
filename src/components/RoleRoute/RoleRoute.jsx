import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { useUserRole } from "../../Hook/useUserRole";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const role =useUserRole();
  console.log(role);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

  return children;
};

export default RoleRoute;

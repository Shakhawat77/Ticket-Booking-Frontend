import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);

      if ((payload.exp && payload.exp < now) || (allowedRoles && !allowedRoles.includes(payload.role))) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("accessToken");
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [allowedRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;

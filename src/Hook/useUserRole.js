import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const { user } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user?.email) return;

    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(`${BACKEND_URL}/users/email/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.role) setRole(data.role);
      } catch (err) {
        console.error("Error fetching user role:", err.response?.data || err.message);
      }
    };

    fetchRole();
  }, [user]);

  return role;
}

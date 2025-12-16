import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true; // flag to avoid state update after unmount
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token found, skipping role fetch.");
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/users/email/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted) {
          setRole(data?.role || null); // fallback to null if role missing
        }
      } catch (err) {
        if (isMounted) setRole(null);
        console.error(
          "Error fetching user role:",
          err.response?.data || err.message
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRole();

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, [user?.email, BACKEND_URL]); // refetch if user email or backend URL changes

  return { role, loading };
}

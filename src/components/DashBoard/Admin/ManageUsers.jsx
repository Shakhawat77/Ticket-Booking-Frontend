import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  /* ---------------- FETCH USERS (ADMIN) ---------------- */
  useEffect(() => {
    if (!token) return;

    fetch(`${backendUrl}/users`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load users");
        setLoading(false);
      });
  }, [backendUrl, token]);

  /* ---------------- UPDATE ROLE ---------------- */
  const updateRole = async (id, role) => {
    try {
      const res = await fetch(`${backendUrl}/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );

      toast.success(`Role changed to ${role}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  /* ---------------- MARK AS FRAUD ---------------- */
  const markFraud = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/users/fraud/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to mark as fraud");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isFraud: true } : u))
      );

      toast.success("Vendor marked as fraud");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading users...</p>;
  }

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.role}</td>

                <td className="border px-2 py-1 flex flex-wrap gap-2">
                  {user.role !== "ADMIN" && (
                    <>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateRole(user._id, "ADMIN")}
                      >
                        Make Admin
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateRole(user._id, "VENDOR")}
                      >
                        Make Vendor
                      </button>
                    </>
                  )}

                  {user.role === "VENDOR" && !user.isFraud && (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => markFraud(user._id)}
                    >
                      Mark as Fraud
                    </button>
                  )}

                  {user.isFraud && (
                    <span className="text-red-500 font-semibold">
                      Fraud Vendor
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;

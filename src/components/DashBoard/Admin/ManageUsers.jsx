import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch users
  useEffect(() => {
    fetch(`${backendUrl}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, [backendUrl]);

  // Update user role
  const updateRole = async (_id, role) => {
    try {
      const res = await fetch(`${backendUrl}/users/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers(users.map(u => u._id === _id ? { ...u, role } : u));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update role");
    }
  };

  // Mark user as fraud
  const markFraud = async (_id) => {
    try {
      const res = await fetch(`${backendUrl}/users/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fraud: true }),
      });
      if (!res.ok) throw new Error("Failed to mark as fraud");
      setUsers(users.map(u => u._id === _id ? { ...u, fraud: true } : u));
      toast.success("User marked as fraud");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to mark fraud");
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
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
              <td className="border px-2 py-1 flex gap-2 flex-wrap">
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
                {user.role === "VENDOR" && !user.fraud && (
                  <button
                    className="btn btn-sm btn-red-500"
                    onClick={() => markFraud(user._id)}
                  >
                    Mark as Fraud
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const updateRole = async (id, role) => {
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const markFraud = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fraud: true }),
      });
      setUsers(users.map(u => u.id === id ? { ...u, fraud: true } : u));
      toast.success("User marked as fraud");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark fraud");
    }
  };

  return (
    <div>
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
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-2 py-1">{user.name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.role}</td>
              <td className="border px-2 py-1 flex gap-2">
                {user.role !== "admin" && (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={() => updateRole(user.id, "admin")}>Make Admin</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => updateRole(user.id, "vendor")}>Make Vendor</button>
                  </>
                )}
                {user.role === "vendor" && !user.fraud && (
                  <button className="btn btn-sm btn-red-500" onClick={() => markFraud(user.id)}>Mark as Fraud</button>
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

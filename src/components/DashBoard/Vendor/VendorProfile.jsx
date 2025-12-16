import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";

const VendorProfile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 text-lg font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-32 text-lg font-semibold text-gray-600">
        No user data available.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto ">
      <h2 className="text-2xl text-center font-bold mb-4">Vendor Profile</h2>
      <div className="flex flex-col items-center gap-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl">
            {user.email[0].toUpperCase()}
          </div>
        )}
        <p>
          <strong>Name:</strong> {user.displayName || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role || "Vendor"}
        </p>
      </div>
    </div>
  );
};

export default VendorProfile;

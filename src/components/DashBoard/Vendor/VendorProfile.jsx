import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";

const VendorProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">Vendor Profile</h2>
      <div className="flex flex-col items-center gap-4">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Vendor" className="w-24 h-24 rounded-full" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl">
            {user?.email[0].toUpperCase()}
          </div>
        )}
        <p><strong>Name:</strong> {user?.displayName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> Vendor</p>
      </div>
    </div>
  );
};

export default VendorProfile;

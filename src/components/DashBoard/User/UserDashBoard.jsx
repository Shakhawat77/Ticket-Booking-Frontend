

import { Outlet } from "react-router";


const UserDashboard = () => {
  return (
    <div>
      
      <h2 className="text-2xl text-center font-bold mb-4">User Dashboard</h2>
      <Outlet />
    
    </div>
  );
};

export default UserDashboard;

// DashboardLayout.jsx

import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link, Outlet } from "react-router";


const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold text-xl mb-4">Dashboard</h2>
        <ul className="space-y-2">
          {user.role === "ADMIN" && (
            <>
              <li><Link to="/dashboard/admin">Admin Home</Link></li>
              <li><Link to="/dashboard/admin/users">Manage Users</Link></li>
              <li><Link to="/dashboard/admin/tickets">Manage Tickets</Link></li>
            </>
          )}
          {user.role === "VENDOR" && (
            <>
              <li><Link to="/dashboard/vendor">Vendor Home</Link></li>
              <li><Link to="/dashboard/vendor/addTicket">Add Ticket</Link></li>
              <li><Link to="/dashboard/vendor/myTickets">My Tickets</Link></li>
            </>
          )}
          {user.role === "USER" && (
            <>
              <li><Link to="/dashboard/user">My Bookings</Link></li>
              <li><Link to="/allTickets">Book Tickets</Link></li>
            </>
          )}
        </ul>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

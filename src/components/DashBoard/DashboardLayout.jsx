// DashboardLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { useUserRole } from "../../Hook/useUserRole";

const DashboardLayout = () => {
  const role = useUserRole(); // custom hook returns role or null while loading

  // Loading state
  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  // Define sidebar links based on role
  const sidebarLinks = {
    ADMIN: [
      { name: "Admin Home", path: "/dashboard/admin" },
      { name: "Manage Users", path: "/dashboard/admin/users" },
      { name: "Manage Tickets", path: "/dashboard/admin/tickets" },
    ],
    VENDOR: [
      { name: "Vendor Home", path: "/dashboard/vendor" },
      { name: "Add Ticket", path: "/dashboard/vendor/addTicket" },
      { name: "My Tickets", path: "/dashboard/vendor/myTickets" },
    ],
    USER: [
      { name: "My Bookings", path: "/dashboard/user" },
      { name: "Book Tickets", path: "/allTickets" },
    ],
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold text-xl mb-4">Dashboard</h2>
        <ul className="space-y-2">
          {sidebarLinks[role].map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="hover:text-blue-600">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

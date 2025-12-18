import { Link } from "react-router";
import { useUserRole } from "../../Hook/useUserRole";

const DashboardSidebar = () => {
  const { role, loading } = useUserRole(); 

  if (loading) return <div>Loading...</div>; 

  console.log(role); 

  return (
    <ul className="menu p-4 w-64 bg-gradient-to-br from-yellow-300 via-orange-400 to-green-500">
      {role === "USER" && (
        <>
          <li>
            <Link to="/dashboard/user/profile">User Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/user/bookings">My Booked Tickets</Link>
          </li>
          <li>
            <Link to="/dashboard/user/transactions">Transaction History</Link>
          </li>
        </>
      )}

      {role === "VENDOR" && (
        <>
          <li>
            <Link to="/dashboard/vendor/profile">Vendor Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/vendor/add-ticket">Add Ticket</Link>
          </li>
          <li>
            <Link to="/dashboard/vendor/my-tickets">My Added Tickets</Link>
          </li>
          <li>
            <Link to="/dashboard/vendor/bookings">Requested Bookings</Link>
          </li>
          <li>
            <Link to="/dashboard/vendor/revenue">Revenue Overview</Link>
          </li>
        </>
      )}

      {role === "ADMIN" && (
        <>
          <li>
            <Link to="/dashboard/admin/profile">Admin Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/manage-tickets">Manage Tickets</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/manage-users">Manage Users</Link>
          </li>
          <li>
            <Link to="/dashboard/admin/advertise">Advertise Tickets</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default DashboardSidebar;

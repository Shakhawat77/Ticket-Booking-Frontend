
import { NavLink, useNavigate  } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  const links = (
    <>
      <li><NavLink to="/">Home</NavLink> </li>
      <li><NavLink to="/all-ticket"> All Tickets</NavLink> </li>
      <li><NavLink to="/dashboard">DashBoard</NavLink> </li>
    </>
  );

  return (
    <>
     
      <div>
        <div
          className="navbar shadow-sm px-4 relative"
         
        >
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
              >
                {links}
              </ul>
            </div>
            <NavLink to="/" className="font-bold text-xl text-blue-900 animate-pulse">
               Ticketk Booking Platfrom 
            </NavLink>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className="navbar-end gap-2 items-center">
            {user ? (
              <>
                {user.photoURL ? (
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip={user.displayName || user.email}
                  >
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                  </div>
                ) : (
                  <div
                    className="tooltip tooltip-bottom w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white"
                    data-tip={user.displayName || user.email}
                  >
                    {user.email[0].toUpperCase()}
                  </div>
                )}

                <button
                  className="btn btn-sm btn-primary animate-gradient"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                {
                  user ?  <button
                  className="btn btn-sm btn-primary animate-gradient"
                  onClick={handleLogout}
                >
                  Logout
                </button>:<NavLink to="/login" className="btn btn-sm btn-outline animate-gradient">
                  Login
                </NavLink>
                }
               
                
               
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

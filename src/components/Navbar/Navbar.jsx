import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthProvider.jsx";
import { FaBus, FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "../ThemeToggole/ThemeToggole.jsx";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/allTickets">All Tickets</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar shadow-md px-4 py-2 flex items-center justify-between bg-gradient-to-r from-[#89A8B2] to-[#266352] text-white relative">
      <div className="flex items-center gap-2">
        <FaBus size={24} />
        <NavLink to="/" className="font-bold text-xl">
          TicketBari
        </NavLink>
      </div>
      <ul className="hidden lg:flex gap-6">{links}</ul>
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                {user.email[0].toUpperCase()}
              </div>
            )}

            <span className="font-semibold">{user.displayName || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2">
            <NavLink
              to="/login"
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-black transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Register
            </NavLink>
          </div>
        )}

        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-gray-700 text-white flex flex-col gap-4 p-4 lg:hidden">
          {links}
          {!user && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import { GiClapperboard } from "react-icons/gi";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">
        <GiClapperboard className="logo-icon" />
        <span>MovieFinder</span>
      </h1>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
          🔍 Search
        </NavLink>
        <NavLink to="/upcoming" className={({ isActive }) => isActive ? "active-link" : ""}>
          🎬 Upcoming
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? "active-link" : ""}>
          💖 Favorites
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

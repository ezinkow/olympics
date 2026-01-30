import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const NAVBAR_HEIGHT = 60; // adjust to your navbar height

  return (
    <>
      <header
        className="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: `${NAVBAR_HEIGHT}px`,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="navbar-center" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <nav className="navbar-links" style={{ display: "flex", gap: "16px" }}>
            <Link to="/countrypicks" className={isActive("/rosterpicks") ? "active" : ""}>
              Create Roster
            </Link>
            <Link to="/scoreboard" className={isActive("/scoreboard") ? "active" : ""}>
              Scoreboard
            </Link>
            <Link to="/standings" className={isActive("/standings") ? "active" : ""}>
              Standings
            </Link>
            <Link to="/medaltable" className={isActive("/medaltable") ? "active" : ""}>
              Medal Table
            </Link>
            <Link to="/signup" className={isActive("/signup") ? "active" : ""}>
              Sign Up
            </Link>
          </nav>

          <Link to="/" className="navbar-brand" style={{ fontWeight: "bold" }}>
            🏅Olympics Pool
          </Link>
        </div>
      </header>

      {/* Spacer so page content isn’t hidden under fixed navbar */}
      <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
    </>
  );
}

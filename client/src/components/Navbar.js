import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NAVBAR_HEIGHT = 60;

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const handleNavClick = (path) => {
    setMenuOpen(false);

    if (location.pathname !== path) {
      navigate(path);
    }
  };


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
        <div
          className="navbar-center"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Hamburger */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Links */}
          <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
            <button onClick={() => handleNavClick("/")}>Home</button>
            <button onClick={() => handleNavClick("/countrypicks")}>Create Team</button>
            <button onClick={() => handleNavClick("/standings")}>Standings</button>
            <button onClick={() => handleNavClick("/scoreboard")}>Scoreboard</button>
            <button onClick={() => handleNavClick("/myteam")}>My Team</button>
            <button onClick={() => handleNavClick("/medaltable")}>Medal Table</button>
            <button onClick={() => handleNavClick("/signup")}>Sign Up</button>
          </nav>

          {/* Brand */}
          <Link to="/" className="navbar-brand">
            ⛷ Olympics Salary Cap 🏒
          </Link>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Spacer */}
      <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
      <nav className="mobile-bottom-nav">
        <button
          onClick={() => handleNavClick("/")}
          className="mobile-nav-link"
        >
          🏠
        </button>
        <button
          onClick={() => handleNavClick("/countrypicks")}
          className="mobile-nav-link"
        >
          📝
        </button>
        <button
          onClick={() => handleNavClick("/standings")}
          className="mobile-nav-link"
        >
          🏅
        </button>
        <button
          onClick={() => handleNavClick("/scoreboard")}
          className="mobile-nav-link"
        >
          🔢
        </button>
        <button
          onClick={() => handleNavClick("/medaltable")}
          className="mobile-nav-link"
        >
          📊
        </button>
        <button
          onClick={() => handleNavClick("/myteam")}
          className="mobile-nav-link"
        >
          👤
        </button>
        {/* <Link to="/">🏠</Link>
        <Link to="/countrypicks">📝</Link>
        <Link to="/standings">🏅</Link>
        <Link to="/scoreboard">🔢</Link>
        <Link to="/medaltable">📊</Link>
        <Link to="/myteam">👤</Link> */}
      </nav>

    </>
  );
}

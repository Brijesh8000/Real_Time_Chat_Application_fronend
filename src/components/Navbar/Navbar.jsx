
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return localStorage.getItem("chatter-theme") === "dark"
      ? "dark"
      : "light";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Apply and save the selected theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chatter-theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const handleThemeToggle = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  // Close mobile menu after navigation
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const getNavLinkClass = ({ isActive }) =>
    `navbar__link ${isActive ? "navbar__link--active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar__inner page-container">

        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar__brand"
          onClick={handleNavigation}
          aria-label="Chatter home"
        >
          <span className="navbar__logo-mark" aria-hidden="true">
            c<span>.</span>
          </span>

          <span className="navbar__brand-text">
            <strong>Chatter</strong>
            <small>REAL-TIME CHAT</small>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav
          id="primary-navigation"
          className={`navbar__menu ${
            isMenuOpen ? "navbar__menu--open" : ""
          }`}
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
            className={getNavLinkClass}
            onClick={handleNavigation}
          >
            Home
          </NavLink>

          <NavLink
            to="/create-room"
            className={getNavLinkClass}
            onClick={handleNavigation}
          >
            Create Room
          </NavLink>

          <NavLink
            to="/join-room"
            className={({ isActive }) =>
              `navbar__link navbar__join-link ${
                isActive ? "navbar__link--active" : ""
              }`
            }
            onClick={handleNavigation}
          >
            Join Room
            <span className="navbar__join-arrow" aria-hidden="true">
              ↗
            </span>
          </NavLink>
        </nav>

        {/* Theme Toggle and Mobile Menu */}
        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__theme-toggle"
            onClick={handleThemeToggle}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <span aria-hidden="true">
              {theme === "dark" ? "☀" : "☾"}
            </span>
          </button>

          <button
            type="button"
            className="navbar__menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;

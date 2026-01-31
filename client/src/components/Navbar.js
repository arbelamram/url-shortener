// src/components/Navbar.js
// ---------------------------------------------
// Global Navigation Bar
// ---------------------------------------------
// Purpose:
// - Provides top-level navigation across the app.
// - Highlights the active route for better UX.
//
// Design notes:
// - Uses NavLink for automatic active-state styling.
// - Styling lives in global.css (layout-level component).

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-inner">
        {/* Brand / home link */}
        <NavLink className="brand" to="/">
          Shorten URL
        </NavLink>

        {/* Primary navigation actions */}
        <div className="nav-links">
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Create
          </NavLink>

          <NavLink
            to="/urls"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            My URLs
          </NavLink>
        </div>
      </div>
    </div>
  );
}

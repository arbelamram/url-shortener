// src/components/Navbar.js
// ---------------------------------------------
// Global Navigation Bar
// ---------------------------------------------
// Purpose:
// - Provides top-level navigation across the app.
// - Rendered once in App.js and shared by all pages.
//
// Design notes:
// - Intentionally simple and minimal.
// - No routing logic here; only <Link /> usage.
// - Styling is kept in global.css because this is
//   a global layout component.

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-inner">
        {/* Brand / home link */}
        <Link className="brand" to="/">
          Shorten URL
        </Link>

        {/* Primary navigation actions */}
        <div className="nav-links">
          <Link className="nav-link" to="/create">
            Create
          </Link>
          <Link className="nav-link" to="/urls">
            My URLs
          </Link>
        </div>
      </div>
    </div>
  );
}

// client/src/components/Navbar.js
// Global navigation component: provides top-level routing links and active route highlighting.

import { NavLink } from 'react-router-dom';

/**
 * Navbar component.
 * Displays application brand and primary navigation links.
 * Uses NavLink to automatically apply active styling based on current route.
 */
export default function Navbar() {
  return (
    <nav className='nav'>
      <div className='nav-inner'>
        {/* Brand / home link */}
        <NavLink className='brand' to='/'>
          Shorten URL
        </NavLink>

        {/* Primary navigation actions */}
        <div className='nav-links'>
          <NavLink
            to='/create'
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Create
          </NavLink>

          <NavLink
            to='/urls'
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            My URLs
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

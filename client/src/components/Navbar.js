// src/components/Navbar.js
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">Shorten URL</Link>

        <div className="nav-links">
          <Link className="nav-link" to="/create">Create</Link>
          <Link className="nav-link" to="/urls">My URLs</Link>
        </div>
      </div>
    </div>
  );
}

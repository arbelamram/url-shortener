// src/pages/LandingPage.js
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="container">
      <h1>Shorten URLs. Instantly.</h1>
      <p className="muted">Clean, fast URL shortening with a simple interface.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link className="btn" to="/create">Create</Link>
        <Link className="btn outline" to="/urls">My URLs</Link>
      </div>
    </div>
  );
}

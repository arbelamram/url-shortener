// src/pages/LandingPage.js
// ---------------------------------------------
// Landing Page
// ---------------------------------------------
// Purpose:
// - First impression page (simple, fast, "one-click shorten").
// - Allows shortening immediately without showing management UI (table).
//
// UX concept:
// - Hero (what the app does)
// - Shorten form (primary action)
// - Result card (copy + quick navigation) OR secondary CTAs
//
// Notes:
// - This page intentionally does NOT mention database/storage.
// - Management actions (edit/delete) live under /urls.

import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css";

import CopyButton from "../components/CopyButton";
import { createUrl } from "../api/urlApi";

export default function LandingPage() {
  // User input for the URL to shorten
  const [longUrl, setLongUrl] = useState("");

  // Async state for form submission UX
  const [loading, setLoading] = useState(false);

  // Alert is used for errors only (we keep messaging simple)
  const [alert, setAlert] = useState("");

  // Holds the most recently created URL object (used to render the result card)
  const [result, setResult] = useState(null);

  /**
   * Main action: shorten a URL
   * - Validates input
   * - Calls backend: POST /api/url
   * - On success: shows result card + copy button
   */
  const handleShorten = async (e) => {
    e.preventDefault();
    setAlert("");

    const value = longUrl.trim();

    // Basic validation (front-end). Server still validates too.
    if (!value) {
      setAlert("Please enter a URL.");
      return;
    }

    setLoading(true);
    try {
      // API returns: { message, url }
      const res = await createUrl(value);

      if (res?.url) {
        setResult(res.url);
        setLongUrl("");
      } else {
        // If server returns a message but no url, treat as an error case
        setAlert(res?.message || "Could not create short URL.");
      }
    } catch (err) {
      console.error(err);
      setAlert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convenience derived value used for conditional rendering
  const shortUrl = result?.shortUrl;

  return (
    <div className="container">
      {/* HERO: message + short description */}
      <div className="landing-hero">
        <h1 className="landing-title">Shorten URLs. Instantly.</h1>
        <p className="muted landing-subtitle">
          Clean, fast URL shortening with a simple interface.
        </p>
      </div>

      {/* SHORTEN CARD: primary action form + result/CTAs */}
      <div className="landing-card">
        {/* Primary form: user pastes long URL and submits */}
        <form onSubmit={handleShorten} className="landing-form">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste a long URL here..."
            className="landing-input"
          />

          <button
            type="submit"
            disabled={loading || !longUrl.trim()}
            className={`landing-submit ${loading ? "is-loading" : ""}`}
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </form>

        {/* Error alert (only shown when needed) */}
        {alert ? <div className="landing-alert">{alert}</div> : null}

        {/* RESULT CARD: shows the created short URL + copy + quick actions */}
        {shortUrl ? (
          <div className="result-card">
            <div className="result-title">Your short URL is ready</div>

            <div className="result-row">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="result-link"
              >
                {shortUrl}
              </a>

              <CopyButton text={shortUrl} />
            </div>

            <div className="result-actions">
              <Link className="btn outline" to="/create">
                Create another
              </Link>
              <Link className="btn outline" to="/urls">
                View my URLs
              </Link>
            </div>

            {/* Optional: show original URL subtly for transparency */}
            <div className="muted original-row">
              Original:{" "}
              <a href={result.longUrl} target="_blank" rel="noreferrer">
                {result.longUrl}
              </a>
            </div>
          </div>
        ) : null}

        {/* Secondary actions: shown when user hasn't created a URL yet */}
        {!shortUrl ? (
          <div className="landing-secondary-actions">
            <Link className="btn outline" to="/urls">
              View my URLs
            </Link>
            <Link className="btn outline" to="/create">
              Advanced mode
            </Link>
          </div>
        ) : null}
      </div>

      {/* Small footer line (lightweight product context) */}
      <div className="muted landing-footer">
        No signup • Built with React + Node/Express + MongoDB
      </div>
    </div>
  );
}

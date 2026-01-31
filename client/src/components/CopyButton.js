// src/components/CopyButton.js
// ---------------------------------------------
// CopyButton (Reusable)
// ---------------------------------------------
// Purpose:
// - One-click copy for a given text (usually a short URL).
//
// UX behaviors:
// - Shows "Copied!" briefly after success
// - Shows "Failed" briefly if copy fails
// - Tooltip appears when copied
//
// Implementation notes:
// - Uses navigator.clipboard when available (modern browsers)
// - Falls back to document.execCommand("copy") for older environments
// - Keeps timer cleanup safe to avoid state updates after unmount

import React, { useEffect, useRef, useState } from "react";
import "./CopyButton.css";

export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className = "",
  timeoutMs = 1600,
}) {
  // idle | copied | error
  const [status, setStatus] = useState("idle");

  // Timer ref used to reset visual state back to idle
  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const resetLater = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), timeoutMs);
  };

  /**
   * Fallback method for older browsers.
   * Creates a hidden textarea, selects it, and runs execCommand("copy").
   */
  const fallbackCopy = (value) => {
    const el = document.createElement("textarea");
    el.value = value;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    el.select();
    const ok = document.execCommand("copy");

    document.body.removeChild(el);
    return ok;
  };

  /**
   * Copy handler:
   * - Attempts clipboard API first
   * - Uses fallback if clipboard API isn't available
   * - Updates UI state accordingly
   */
  const handleCopy = async () => {
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ok = fallbackCopy(text);
        if (!ok) throw new Error("fallback copy failed");
      }

      setStatus("copied");
      resetLater();
    } catch (err) {
      console.error("Copy failed:", err);
      setStatus("error");
      resetLater();
    }
  };

  const isCopied = status === "copied";
  const isError = status === "error";

  return (
    <span className={`copy-wrap ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className={`copy-btn ${isCopied ? "is-copied" : ""} ${
          isError ? "is-error" : ""
        }`}
        disabled={!text}
        aria-label="Copy to clipboard"
      >
        <span className="copy-icon" aria-hidden="true">
          {/* Icon switches from "copy" to "check" when copied */}
          {!isCopied ? (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M16 1H6c-1.1 0-2 .9-2 2v10h2V3h10V1zm3 4H10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16h-9V7h9v14z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5L9 16.2z"
              />
            </svg>
          )}
        </span>

        <span className="copy-label">
          {isCopied ? copiedLabel : isError ? "Failed" : label}
        </span>
      </button>

      {/* Tooltip appears briefly after successful copy */}
      <span
        className={`copy-tip ${isCopied ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        Copied
      </span>
    </span>
  );
}

import React, { useEffect, useRef, useState } from "react";

/**
 * CopyButton
 * - One-click copy
 * - Shows "Copied!" for a short time
 * - Subtle micro-interaction (press + hover)
 * - Accessible (aria-live + keyboard)
 */
export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className = "",
  timeoutMs = 1600,
}) {
  const [status, setStatus] = useState("idle"); // idle | copied | error
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const resetLater = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), timeoutMs);
  };

  const fallbackCopy = (value) => {
    // fallback for older browsers
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
        className={`copy-btn ${isCopied ? "is-copied" : ""} ${isError ? "is-error" : ""}`}
        disabled={!text}
        aria-label="Copy to clipboard"
      >
        <span className="copy-icon" aria-hidden="true">
          {/* two-squares icon (copy) */}
          {!isCopied ? (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M16 1H6c-1.1 0-2 .9-2 2v10h2V3h10V1zm3 4H10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16h-9V7h9v14z"
              />
            </svg>
          ) : (
            // check icon
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

      {/* tiny tooltip bubble */}
      <span className={`copy-tip ${isCopied ? "show" : ""}`} role="status" aria-live="polite">
        Copied
      </span>
    </span>
  );
}

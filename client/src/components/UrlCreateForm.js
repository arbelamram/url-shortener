// src/components/UrlCreateForm.js
// ---------------------------------------------
// URL Create Form (Reusable)
// ---------------------------------------------
// Purpose:
// - Handles creation of a new short URL.
// - Encapsulates API interaction + success/error feedback.
// - Not responsible for listing or navigation.
//
// Data flow:
// - Calls POST /api/url
// - Emits the created URL upward via `onCreated`
//   so parent pages can update local state without refetching.

import { useEffect, useState } from "react";
import "./UrlCreateForm.css";

import { createUrl } from "../api/urlApi";

export default function UrlCreateForm({ onCreated }) {
  // User input (long URL)
  const [newLongUrl, setNewLongUrl] = useState("");

  // Alert message shown after creation or error
  const [alertMessage, setAlertMessage] = useState("");

  // Auto-clear alert after a few seconds for cleaner UX
  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  /**
   * Handles URL creation:
   * - Validates input
   * - Calls backend
   * - Clears input on success
   * - Notifies parent via `onCreated`
   */
  const handleCreate = async () => {
    const value = newLongUrl.trim();
    if (!value) return;

    try {
      // API returns: { message, url }
      const result = await createUrl(value);

      setAlertMessage(result.message || "Created");
      setNewLongUrl("");

      // Notify parent page so it can update its local list
      if (result.url && onCreated) {
        onCreated(result.url);
      }
    } catch (err) {
      console.error("Failed to create URL:", err);
      setAlertMessage("Failed to create URL");
    }
  };

  return (
    <div className="url-create">
      <h2 className="url-create-title">Create a New Short URL</h2>

      {/* Success / error feedback */}
      {alertMessage && (
        <div className="url-create-alert">{alertMessage}</div>
      )}

      {/* Input + action */}
      <input
        type="text"
        value={newLongUrl}
        onChange={(e) => setNewLongUrl(e.target.value)}
        placeholder="Enter long URL"
        className="url-create-input"
      />

      <button onClick={handleCreate} className="url-create-btn">
        Create
      </button>
    </div>
  );
}

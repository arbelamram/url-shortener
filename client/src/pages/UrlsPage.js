// src/pages/UrlsPage.js
// ---------------------------------------------
// URLs Page (Management Mode)
// ---------------------------------------------
// Purpose:
// - Central place to manage URLs stored in the database.
// - Displays existing URLs (sorted inside UrlTable)
// - Allows create, edit, delete operations.
//
// Data flow:
// - On mount: fetch all URLs via GET /api/url
// - On create: prepend new URL into local state (no refetch)
// - On delete: remove URL from local state (no refetch)
// - On update: replace the edited URL in local state (no refetch)
//
// Notes:
// - We keep state updates local for faster UI feedback.
// - The API layer lives in /src/api/urlApi.js.
// - Table and form UI are separated into components for readability.

import { useEffect, useState } from "react";
import "../styles/pages/UrlsPage.css";

import { getAllUrls } from "../api/urlApi";
import UrlCreateForm from "../components/UrlCreateForm";
import UrlTable from "../components/UrlTable";

export default function UrlsPage() {
  // backendData shape matches the server response: { urls: [...] }
  // We initialize urls to undefined so we can show a loading state.
  const [backendData, setBackendData] = useState({ urls: undefined });

  // Initial load: fetch all URLs once when the page mounts.
  useEffect(() => {
    getAllUrls().then(setBackendData);
  }, []);

  // Called after a successful create (UrlCreateForm)
  // We insert the new URL at the start for immediate feedback.
  const handleCreated = (newUrl) => {
    setBackendData((prev) => ({
      urls: [newUrl, ...(prev.urls || [])],
    }));
  };

  // Called after a successful delete (UrlTable)
  const handleDeleted = (id) => {
    setBackendData((prev) => ({
      urls: (prev.urls || []).filter((u) => u._id !== id),
    }));
  };

  // Called after a successful update (UrlTable)
  const handleUpdated = (updatedUrl) => {
    setBackendData((prev) => ({
      urls: (prev.urls || []).map((u) =>
        u._id === updatedUrl._id ? updatedUrl : u
      ),
    }));
  };

  // Loading state (before the API response arrives)
  if (typeof backendData.urls === "undefined") return <p>Loading...</p>;

  return (
    <div className="container urls-page">
      <h1 className="urls-title">My Shortened URLs</h1>
      <p className="muted urls-subtitle">
        Create, copy, edit, and manage your short links in one place.
      </p>

      <div className="urls-panel">
        <UrlCreateForm onCreated={handleCreated} />

        <UrlTable
          urls={backendData.urls}
          onDeleted={handleDeleted}
          onUpdated={handleUpdated}
        />
      </div>
    </div>
  );
}

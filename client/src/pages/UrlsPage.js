// client/src/pages/UrlsPage.js
// URLs management page: fetches all saved URLs and provides a single place to create, edit, copy, and delete links.
// Uses local state updates for fast UI feedback (no refetch after each action).

import { useEffect, useState } from 'react';
import '../styles/pages/UrlsPage.css';

import { getAllUrls } from '../api/urlApi';
import UrlCreateForm from '../components/UrlCreateForm';
import UrlTable from '../components/UrlTable';

/**
 * UrlsPage component.
 * Data flow:
 * - On mount: fetch all URLs via GET /api/url
 * - On create: prepend new URL into local state (no refetch)
 * - On delete: remove URL from local state (no refetch)
 * - On update: replace the edited URL in local state (no refetch)
 */
export default function UrlsPage() {
  // Store URLs in state; start as undefined to allow a loading UI
  const [backendData, setBackendData] = useState({ urls: undefined });

  // Track fetch error state so we can show a helpful message instead of hanging on "Loading..."
  const [error, setError] = useState('');

  /**
   * Initial load: fetch all URLs once when the page mounts.
   * Handles errors to prevent unhandled promise rejections and stuck loading state.
   */
  useEffect(() => {
    setError('');
    getAllUrls()
      .then(setBackendData)
      .catch((err) => {
        console.error(err);
        setError(err?.message || 'Failed to load URLs.');
        setBackendData({ urls: [] }); // allow the page to render even on failure
      });
  }, []);

  /**
   * Normalize API return shapes:
   * - create returns { message, url }
   * - update returns { url }
   * This helper allows passing either {url: {...}} or {...} safely.
   */
  function unwrapUrl(maybeWrapped) {
    return maybeWrapped?.url ? maybeWrapped.url : maybeWrapped;
  }

  /**
   * Called after a successful create (UrlCreateForm).
   * Inserts the new URL at the start for immediate feedback.
   */
  const handleCreated = (createdPayload) => {
    const newUrl = unwrapUrl(createdPayload);
    if (!newUrl) return;

    setBackendData((prev) => ({
      urls: [newUrl, ...(prev.urls || [])],
    }));
  };

  /**
   * Called after a successful delete (UrlTable).
   * Removes the deleted URL from local state.
   */
  const handleDeleted = (id) => {
    setBackendData((prev) => ({
      urls: (prev.urls || []).filter((u) => u._id !== id),
    }));
  };

  /**
   * Called after a successful update (UrlTable).
   * Replaces the edited URL in local state.
   */
  const handleUpdated = (updatedPayload) => {
    const updatedUrl = unwrapUrl(updatedPayload);
    if (!updatedUrl) return;

    setBackendData((prev) => ({
      urls: (prev.urls || []).map((u) =>
        u._id === updatedUrl._id ? updatedUrl : u
      ),
    }));
  };

  // Loading state (before the API response arrives)
  if (typeof backendData.urls === 'undefined') {
    return <div className='container urls-page'><p>Loading...</p></div>;
  }

  return (
    <div className='container urls-page'>
      <h1 className='urls-title'>My Shortened URLs</h1>
      <p className='muted urls-subtitle'>
        Create, copy, edit, and manage your short links in one place.
      </p>

      {/* Page-level error message (shown only when needed) */}
      {error ? <div className='urls-alert'>{error}</div> : null}

      <div className='urls-panel'>
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

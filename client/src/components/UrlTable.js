// src/components/UrlTable.js
// ---------------------------------------------
// URL Table (Reusable)
// ---------------------------------------------
// Purpose:
// - Renders a list of stored short URLs in a table.
// - Allows in-row edit of longUrl and deletion of items.
// - Provides quick copy for the short URL.
//
// Data flow:
// - Delete: calls DELETE /api/url/:id, then informs parent via onDeleted(id)
// - Update: calls PUT /api/url/:id, then informs parent via onUpdated(updatedUrl)
// - Parent page owns the authoritative list state and updates it without refetching.
//
// Notes:
// - Sorting is performed via useMemo to avoid resorting on every render.

import { useMemo, useState } from "react";
import "../styles/components/UrlTable.css";

import { deleteUrl as apiDeleteUrl, updateUrl as apiUpdateUrl } from "../api/urlApi";
import CopyButton from "./CopyButton";

export default function UrlTable({ urls, onDeleted, onUpdated }) {
  const [editMode, setEditMode] = useState(null);
  const [editLongUrl, setEditLongUrl] = useState("");

  const sortedUrls = useMemo(() => {
    return Array.isArray(urls)
      ? [...urls].sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];
  }, [urls]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteUrl(id);
      if (onDeleted) onDeleted(id);
    } catch (err) {
      console.error("Failed to delete URL:", err);
    }
  };

  const handleSave = async (id) => {
    try {
      const updated = await apiUpdateUrl(id, editLongUrl);

      setEditMode(null);
      setEditLongUrl("");

      if (onUpdated) onUpdated(updated);
    } catch (err) {
      console.error("Failed to edit URL:", err);
    }
  };

  return (
    <div className="url-table-wrap">
      <h2 className="url-table-title">My Shortened URLs</h2>

      <table className="url-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Long URL</th>
            <th>Short URL</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedUrls.map((url) => (
            <tr key={url._id}>
              {/* Date is slightly muted to reduce visual noise */}
              <td className="cell-muted">{formatDate(url.date)}</td>

              {/* Long URL cell: truncate nicely via .cell-url + .url-text */}
              <td className="cell-url">
                {editMode === url._id ? (
                  <input
                    type="text"
                    value={editLongUrl}
                    onChange={(e) => setEditLongUrl(e.target.value)}
                    className="url-table-input"
                  />
                ) : (
                  <a href={url.longUrl} target="_blank" rel="noopener noreferrer">
                    <span className="url-text">{url.longUrl}</span>
                  </a>
                )}
              </td>

              {/* Short URL cell: also truncates nicely */}
              <td className="cell-url">
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                  <span className="url-text">{url.shortUrl}</span>
                </a>
              </td>

              <td>
                <div className="url-table-actions">
                  <CopyButton text={url.shortUrl} />

                  {editMode === url._id ? (
                    <button onClick={() => handleSave(url._id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(url._id);
                        setEditLongUrl(url.longUrl);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {/* Delete uses a subtle danger style */}
                  <button className="danger" onClick={() => handleDelete(url._id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

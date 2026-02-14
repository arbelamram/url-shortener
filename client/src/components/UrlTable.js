// client/src/components/UrlTable.js
// URL table component: displays a sortable list of stored URLs and supports inline edit + delete actions.
// Communicates changes upward via callbacks so the parent page owns the authoritative list state.

import { useMemo, useState } from 'react';
import '../styles/components/UrlTable.css';

import {
  deleteUrl as apiDeleteUrl,
  updateUrl as apiUpdateUrl,
} from '../api/urlApi';
import CopyButton from './CopyButton';

/**
 * UrlTable component.
 * Props:
 * - urls: Url[] (list to display)
 * - onDeleted: (id: string) => void
 * - onUpdated: (payload: Url | { url: Url }) => void
 */
export default function UrlTable({ urls, onDeleted, onUpdated }) {
  const [editMode, setEditMode] = useState(null);
  const [editLongUrl, setEditLongUrl] = useState('');
  const [error, setError] = useState('');

  /**
   * Sort URLs by date descending (newest first).
   * Uses useMemo to avoid re-sorting on every render.
   */
  const sortedUrls = useMemo(() => {
    return Array.isArray(urls)
      ? [...urls].sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];
  }, [urls]);

  /**
   * Formats a date string into a readable local format.
   */
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  /**
   * Deletes a URL by id and informs parent via onDeleted(id).
   */
  const handleDelete = async (id) => {
    setError('');
    try {
      await apiDeleteUrl(id);
      if (onDeleted) onDeleted(id);
    } catch (err) {
      console.error('Failed to delete URL:', err);
      setError(err?.message || 'Failed to delete URL.');
    }
  };

  /**
   * Saves the edited long URL and informs parent via onUpdated(updatedPayload).
   */
  const handleSave = async (id) => {
    setError('');
    try {
      const updatedPayload = await apiUpdateUrl(id, editLongUrl);

      setEditMode(null);
      setEditLongUrl('');

      if (onUpdated) onUpdated(updatedPayload);
    } catch (err) {
      console.error('Failed to edit URL:', err);
      setError(err?.message || 'Failed to update URL.');
    }
  };

  return (
    <div className='url-table-wrap'>
      <h2 className='url-table-title'>My Shortened URLs</h2>

      {/* Component-level error message (shown only when needed) */}
      {error ? <div className='url-table-alert'>{error}</div> : null}

      <table className='url-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Long URL</th>
            <th>Short URL</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Empty state row (avoids rendering an empty table with no explanation) */}
          {sortedUrls.length === 0 ? (
            <tr>
              <td colSpan={4} className='cell-muted'>
                No URLs yet. Create your first one above.
              </td>
            </tr>
          ) : null}

          {sortedUrls.map((url) => (
            <tr key={url._id}>
              {/* Date is slightly muted to reduce visual noise */}
              <td className='cell-muted'>{formatDate(url.date)}</td>

              {/* Long URL cell: inline edit when row is in edit mode */}
              <td className='cell-url'>
                {editMode === url._id ? (
                  <input
                    type='url'
                    value={editLongUrl}
                    onChange={(e) => setEditLongUrl(e.target.value)}
                    className='url-table-input'
                    autoComplete='off'
                  />
                ) : (
                  <a
                    href={url.longUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <span className='url-text'>{url.longUrl}</span>
                  </a>
                )}
              </td>

              {/* Short URL cell */}
              <td className='cell-url'>
                <a
                  href={url.shortUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <span className='url-text'>{url.shortUrl}</span>
                </a>
              </td>

              <td>
                <div className='url-table-actions'>
                  <CopyButton text={url.shortUrl} />

                  {editMode === url._id ? (
                    <button
                      type='button'
                      onClick={() => handleSave(url._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type='button'
                      onClick={() => {
                        setEditMode(url._id);
                        setEditLongUrl(url.longUrl);
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {/* Delete uses a subtle danger style */}
                  <button
                    type='button'
                    className='danger'
                    onClick={() => handleDelete(url._id)}
                  >
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

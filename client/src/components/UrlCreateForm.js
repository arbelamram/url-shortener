// client/src/components/UrlCreateForm.js
// Reusable URL creation form: handles user input, calls backend to create a short URL,
// shows success/error feedback, and notifies parent components via onCreated callback.

import { useEffect, useState } from 'react';
import '../styles/components/UrlCreateForm.css';

import { createUrl } from '../api/urlApi';

/**
 * UrlCreateForm component.
 * Props:
 * - onCreated: function (optional) — called with created URL so parent can update local state.
 */
export default function UrlCreateForm({ onCreated }) {
  // User input (long URL)
  const [newLongUrl, setNewLongUrl] = useState('');

  // Alert message shown after creation or error
  const [alertMessage, setAlertMessage] = useState('');

  /**
   * Auto-clear alert after a few seconds for cleaner UX.
   */
  useEffect(() => {
    if (!alertMessage) return;

    const timer = setTimeout(() => setAlertMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  /**
   * Handles URL creation:
   * - Validates input
   * - Calls backend
   * - Clears input on success
   * - Notifies parent via onCreated callback
   */
  const handleCreate = async () => {
    const value = newLongUrl.trim();
    if (!value) return;

    try {
      // API returns: { message, url }
      const result = await createUrl(value);

      setAlertMessage(result?.message || 'Created');
      setNewLongUrl('');

      // Notify parent page so it can update its local list
      if (result?.url && onCreated) {
        onCreated(result.url);
      }
    } catch (err) {
      console.error('Failed to create URL:', err);
      setAlertMessage(err?.message || 'Failed to create URL');
    }
  };

  return (
    <div className='url-create'>
      <h2 className='url-create-title'>Create a New Short URL</h2>

      <div className='landing-form'>
        {/* Success / error feedback */}
        {alertMessage && (
          <div className='url-create-alert'>{alertMessage}</div>
        )}

        {/* Input + action */}
        <input
          type='url'
          value={newLongUrl}
          onChange={(e) => setNewLongUrl(e.target.value)}
          placeholder='Enter long URL'
          className='url-create-input'
          autoComplete='off'
        />

        <button
          type='button'
          onClick={handleCreate}
          className='url-create-btn'
          disabled={!newLongUrl.trim()}
        >
          Create
        </button>
      </div>
    </div>
  );
}

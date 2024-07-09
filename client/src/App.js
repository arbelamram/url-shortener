import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [editMode, setEditMode] = useState(null);
  const [newLongUrl, setNewLongUrl] = useState('');

  useEffect(() => {
    fetch("/api/url").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    );
  }, []);

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

  const deleteUrl = async (id) => {
    try {
      await fetch(`/api/url/${id}`, {
        method: 'DELETE',
      });
      setBackendData(prevData => ({
        urls: prevData.urls.filter(url => url._id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete URL:', err);
    }
  };

  const editUrl = async (id) => {
    try {
      const response = await fetch(`/api/url/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl: newLongUrl })
      });
      const updatedUrl = await response.json();
      setBackendData(prevData => ({
        urls: prevData.urls.map(url => (url._id === id ? updatedUrl : url))
      }));
      setEditMode(null);
      setNewLongUrl('');
    } catch (err) {
      console.error('Failed to edit URL:', err);
    }
  };

  const sortedUrls = Array.isArray(backendData.urls)
    ? [...backendData.urls].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div>
      {(typeof backendData.urls === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>URLs Table</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Long URL</th>
                <th>Short URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUrls.map((url, i) => (
                <tr key={i}>
                  <td>{formatDate(url.date)}</td>
                  <td>
                    {editMode === url._id ? (
                      <input
                        type="text"
                        value={newLongUrl}
                        onChange={(e) => setNewLongUrl(e.target.value)}
                      />
                    ) : (
                      <a href={url.longUrl} target="_blank" rel="noopener noreferrer">{url.longUrl}</a>
                    )}
                  </td>
                  <td>
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a>
                  </td>
                  <td>
                    {editMode === url._id ? (
                      <button onClick={() => editUrl(url._id)}>Save</button>
                    ) : (
                      <button onClick={() => { setEditMode(url._id); setNewLongUrl(url.longUrl); }}>Edit</button>
                    )}
                    <button onClick={() => deleteUrl(url._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

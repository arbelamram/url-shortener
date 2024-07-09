import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [newLongUrl, setNewLongUrl] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editLongUrl, setEditLongUrl] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetch("/api/url").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    );
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

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
        body: JSON.stringify({ longUrl: editLongUrl })
      });
      const updatedUrl = await response.json();
      setBackendData(prevData => ({
        urls: prevData.urls.map(url => (url._id === id ? updatedUrl : url))
      }));
      setEditMode(null);
      setEditLongUrl('');
    } catch (err) {
      console.error('Failed to edit URL:', err);
    }
  };

  const createUrl = async () => {
    try {
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl: newLongUrl })
      });
      const result = await response.json();
      setAlertMessage(result.message);
      setBackendData(prevData => ({
        urls: [result.url, ...prevData.urls]
      }));
      setNewLongUrl('');
    } catch (err) {
      console.error('Failed to create URL:', err);
    }
  };

  const sortedUrls = Array.isArray(backendData.urls)
    ? [...backendData.urls].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="container">
      <h1>Shorten URL service</h1>
      <div>
        <h2>Create a New Short URL</h2>
        {alertMessage && <div className="alert">{alertMessage}</div>}
        <input
          type="text"
          value={newLongUrl}
          onChange={(e) => setNewLongUrl(e.target.value)}
          placeholder="Enter long URL"
        />
        <button onClick={createUrl}>Create</button>
      </div>
      <h2>Saved URLs (MongoDB)</h2>
      {(typeof backendData.urls === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <div>
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
                        value={editLongUrl}
                        onChange={(e) => setEditLongUrl(e.target.value)}
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
                      <button onClick={() => { setEditMode(url._id); setEditLongUrl(url.longUrl); }}>Edit</button>
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

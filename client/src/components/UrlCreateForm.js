// src/components/UrlCreateForm.js
import { useEffect, useState } from "react";
import { createUrl } from "../api/urlApi";

export default function UrlCreateForm({ onCreated }) {
  const [newLongUrl, setNewLongUrl] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const handleCreate = async () => {
    if (!newLongUrl.trim()) return;

    try {
      const result = await createUrl(newLongUrl.trim());
      setAlertMessage(result.message || "Created");
      setNewLongUrl("");

      // tell parent page about new item so it can prepend/update list
      if (result.url && onCreated) onCreated(result.url);
    } catch (err) {
      console.error("Failed to create URL:", err);
      setAlertMessage("Failed to create URL");
    }
  };

  return (
    <div>
      <h2>Create a New Short URL</h2>
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <input
        type="text"
        value={newLongUrl}
        onChange={(e) => setNewLongUrl(e.target.value)}
        placeholder="Enter long URL"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

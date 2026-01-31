// src/components/UrlTable.js
import { useMemo, useState } from "react";
import { deleteUrl as apiDeleteUrl, updateUrl as apiUpdateUrl } from "../api/urlApi";
import CopyButton from "../components/CopyButton";

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
        <div>
            <h2>My Shortened URLs</h2>

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
                    {sortedUrls.map((url) => (
                        <tr key={url._id}>
                            <td>{formatDate(url.date)}</td>

                            <td>
                                {editMode === url._id ? (
                                    <input
                                        type="text"
                                        value={editLongUrl}
                                        onChange={(e) => setEditLongUrl(e.target.value)}
                                    />
                                ) : (
                                    <a href={url.longUrl} target="_blank" rel="noopener noreferrer">
                                        {url.longUrl}
                                    </a>
                                )}
                            </td>

                            <td>
                                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                                    {url.shortUrl}

                                </a>
                            </td>

                            <td>
                                {/* Copy */}
                                <CopyButton text={url.shortUrl} />

                                {/* Save / Edit */}
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

                                {/* Delete */}
                                <button onClick={() => handleDelete(url._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

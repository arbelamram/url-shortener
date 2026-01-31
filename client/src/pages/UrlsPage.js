// src/pages/UrlsPage.js
import { useEffect, useState } from "react";
import { getAllUrls } from "../api/urlApi";
import UrlCreateForm from "../components/UrlCreateForm";
import UrlTable from "../components/UrlTable";

export default function UrlsPage() {
  const [backendData, setBackendData] = useState({ urls: undefined });

  useEffect(() => {
    getAllUrls().then(setBackendData);
  }, []);

  const handleCreated = (newUrl) => {
    setBackendData((prev) => ({
      urls: [newUrl, ...(prev.urls || [])],
    }));
  };

  const handleDeleted = (id) => {
    setBackendData((prev) => ({
      urls: (prev.urls || []).filter((u) => u._id !== id),
    }));
  };

  const handleUpdated = (updatedUrl) => {
    setBackendData((prev) => ({
      urls: (prev.urls || []).map((u) => (u._id === updatedUrl._id ? updatedUrl : u)),
    }));
  };

  if (typeof backendData.urls === "undefined") return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Shorten URL service</h1>

      <UrlCreateForm onCreated={handleCreated} />

      <UrlTable
        urls={backendData.urls}
        onDeleted={handleDeleted}
        onUpdated={handleUpdated}
      />
    </div>
  );
}

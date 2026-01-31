// src/pages/CreatePage.js
// ---------------------------------------------
// Create Page (Tool Mode)
// ---------------------------------------------
// Purpose:
// - A focused page for generating new short URLs.
// - Keeps the experience simple and distraction-free.
//
// Notes:
// - The creation UI itself lives in <UrlCreateForm /> so it can be reused.

import "../styles/pages/CreatePage.css";
import UrlCreateForm from "../components/UrlCreateForm";

export default function CreatePage() {
  return (
    <div className="container create-page">
      <h1 className="create-title">Create a short link</h1>
      <p className="muted create-subtitle">
        Paste a long URL and generate a short link you can copy and share.
      </p>

      <div className="create-panel">
        <UrlCreateForm />
      </div>
    </div>
  );
}

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
// - Management actions (edit/delete) remain under /urls.

import "./CreatePage.css";
import UrlCreateForm from "../components/UrlCreateForm";

export default function CreatePage() {
  return (
    <div className="container create-page">
      <h1 className="create-title">Shorten URL service</h1>
      <UrlCreateForm />
    </div>
  );
}

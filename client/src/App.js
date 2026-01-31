// src/App.js
// ---------------------------------------------
// App Composition / Routing
// ---------------------------------------------
// This file intentionally contains no business logic.
// It only wires the app together:
// - Router setup
// - Global layout components (Navbar)
// - Page routes
//
// Keeping App.js "thin" makes the project easier to scan
// for new contributors/reviewers (UX and code clarity).

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import UrlsPage from "./pages/UrlsPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global navigation shown on every page */}
      <Navbar />

      {/* Main routes */}
      <Routes>
        {/* Landing / marketing + quick shorten */}
        <Route path="/" element={<LandingPage />} />

        {/* Focused tool mode: create a short URL */}
        <Route path="/create" element={<CreatePage />} />

        {/* Management mode: list/edit/delete URLs */}
        <Route path="/urls" element={<UrlsPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

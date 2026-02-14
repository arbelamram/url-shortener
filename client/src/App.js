// client/src/App.js
// Application composition and routing layer: defines the global layout (Navbar)
// and maps URL routes to their corresponding page components.
//
// This file intentionally contains no business logic.
// It only wires together the router, layout, and pages,
// keeping the structure easy to understand and maintain.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout component displayed on all pages
import Navbar from './components/Navbar';

// Page-level route components
import LandingPage from './pages/LandingPage';
import CreatePage from './pages/CreatePage';
import UrlsPage from './pages/UrlsPage';

/**
 * Root application component.
 * Sets up client-side routing and global layout structure.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Global navigation shown on every page */}
      <Navbar />

      {/* Main application routes */}
      <Routes>
        {/* Landing / marketing + quick shorten */}
        <Route path='/' element={<LandingPage />} />

        {/* Focused tool mode: create a short URL */}
        <Route path='/create' element={<CreatePage />} />

        {/* Management mode: list/edit/delete URLs */}
        <Route path='/urls' element={<UrlsPage />} />

        {/* Fallback for unknown routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

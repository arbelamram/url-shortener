// client/src/index.js
// React app entry point: loads global styles and mounts the root <App /> component into the DOM.

import React from 'react';
import ReactDOM from 'react-dom/client';

// Global (shared) styles: tokens first (design system), then base resets, then global layout
import './styles/tokens.css';
import './styles/base.css';
import './styles/global.css';

import App from './App';

/**
 * Locate the root DOM node and mount the React application.
 * If the #root element is missing, fail early with a helpful error.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element "#root" was not found in index.html');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

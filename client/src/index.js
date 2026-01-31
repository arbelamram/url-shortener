import React from "react";
import ReactDOM from "react-dom/client";

// Global (shared) styles
import "./styles/global.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

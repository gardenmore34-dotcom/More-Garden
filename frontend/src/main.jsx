import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext"
import { HelmetProvider } from 'react-helmet-async';
import "./index.css"; // Import Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </React.StrictMode>
  </BrowserRouter>
);

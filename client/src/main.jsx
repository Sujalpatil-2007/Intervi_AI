import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles.css";

import QueryProvider from "./providers/QueryProvider";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
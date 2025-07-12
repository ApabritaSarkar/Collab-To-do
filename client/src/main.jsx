import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "@fontsource/inter";
import { Toaster } from "sonner";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
    <Toaster richColors position="top-center" />
  </AuthProvider>
);

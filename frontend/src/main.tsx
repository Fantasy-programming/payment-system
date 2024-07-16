import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource-variable/inter";
import "./index.css";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./providers/AuthProvider";
import Routes from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>,
);

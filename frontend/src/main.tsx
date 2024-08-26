import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource-variable/inter";
import "./index.css";

import { Toaster } from "@/components/ui/sonner";
import Routes from "./routes";
import { AuthProvider } from "@/providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
      <Toaster richColors />
    </AuthProvider>
  </React.StrictMode>,
);

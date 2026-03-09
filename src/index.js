import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const clientId =
  "764231486834-0dkgeaanq8gm9hj2usop4g8m9sr92qcb.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

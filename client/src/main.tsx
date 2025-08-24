// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react"; // not @clerk/clerk-react-router!
import { BrowserRouter } from "react-router-dom";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    CLERK_PUBLISHABLE_KEY?: string;
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                       (typeof window !== 'undefined' && window.CLERK_PUBLISHABLE_KEY);

console.log('Clerk Publishable Key:', PUBLISHABLE_KEY);
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap ClerkProvider first */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* Then wrap your router here */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);

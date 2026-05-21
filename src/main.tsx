import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CirclesProvider } from "@/lib/circles/CirclesProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CirclesProvider>
      <App />
    </CirclesProvider>
  </StrictMode>,
);

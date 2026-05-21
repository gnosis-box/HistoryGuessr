import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CirclesProvider } from "@/lib/circles/CirclesProvider";
import { ReputationProvider } from "@/lib/reputation/ReputationProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CirclesProvider>
      <ReputationProvider>
        <App />
      </ReputationProvider>
    </CirclesProvider>
  </StrictMode>,
);

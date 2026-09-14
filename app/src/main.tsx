import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { FornitoreApprendimento } from "@/stato/ApprendimentoContext";
import "./index.css";

const radice = document.getElementById("root");
if (!radice) throw new Error("Elemento #root non trovato in index.html");

createRoot(radice).render(
  <StrictMode>
    <FornitoreApprendimento>
      <App />
    </FornitoreApprendimento>
  </StrictMode>,
);

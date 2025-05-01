/*
 * Importa StrictMode de React per habilitar el mode estricte
 * Importa createRoot de react-dom/client per renderitzar l'aplicació
 * Importa els estils de Bootstrap i personalitzats
 * Importa el component principal de l'aplicació
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles.css";
import App from "./App";

/**
 * Crea l'arrel de l'aplicacio.
 * Envolta l'aplicació en StrictMode per detectar problemes potencials
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

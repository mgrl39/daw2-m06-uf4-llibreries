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
 * Renderitza l'aplicació dins l'element amb id 'root'
 * Envolta l'aplicació en StrictMode per detectar problemes potencials
 */
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
};

/**
 * Si el document està completament carregat, renderitza l'aplicació
 * Si no, espera a que el document estigui completament carregat
 */
if (document.readyState == "complete") renderApp();
else window.addEventListener("load", renderApp);

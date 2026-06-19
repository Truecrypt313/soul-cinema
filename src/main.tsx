import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </HelmetProvider>
);

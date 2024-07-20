import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <ThemeProvider>
      <App />
  </ThemeProvider>
  // </React.StrictMode>,
);

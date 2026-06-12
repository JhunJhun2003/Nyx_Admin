import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <App />
  </>,
);

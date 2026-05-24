import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AnapathAnnotator from "./anapath-annotator.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AnapathAnnotator />
  </StrictMode>
);

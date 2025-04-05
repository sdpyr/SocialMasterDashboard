import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create the root container and render the app
const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found! Make sure there's a div with id 'root' in index.html");
}

createRoot(root).render(<App />);

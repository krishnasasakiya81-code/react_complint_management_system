import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DepartmentAuthProvider } from "./context/DepartmentAuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DepartmentAuthProvider>
          <App />
        </DepartmentAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
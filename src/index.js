import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./firebase/ProtectedRoute";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

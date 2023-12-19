import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = auth.currentUser;

  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
export default ProtectedRoute;

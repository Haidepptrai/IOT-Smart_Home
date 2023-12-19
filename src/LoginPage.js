import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    //Use subscribe to catch if user id is correct
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/app");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h2 className="text-lg text-center font-semibold text-gray-700">
          Login
        </h2>

        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block mt-3">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 leading-6 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700"
            >
              Login
            </button>
          </div>

          {error && (
            <Alert severity="warning" className="mt-2">
              {error}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;

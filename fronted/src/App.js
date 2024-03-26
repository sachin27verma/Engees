import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Home from "./components/Home";
import Controller from "./components/Controller";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (token) {
        try {
          const response = await axios.get(
            "https://engeesserver.vercel.app/api/profile",
            {
              headers: {
                authorization: `${token}`,
                
              },
              mode:'no-core',
            }
          );
          // console.log("Authenticated");
          setIsAuthenticated(true);
          setUserData(response.data.profileData);
        } catch (error) {
          // console.error("Error verifying token:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            handleLogin={handleLogin}
            isAuthenticated={isAuthenticated}
          />
        }
      />
      <Route path="/home" element={<Home userData={userData} />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home userData={userData} handleLogout={handleLogout} />
          ) : (
            // <Navigate to="/login" />
            <Controller handleLogin={handleLogin}
            isAuthenticated={isAuthenticated} />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

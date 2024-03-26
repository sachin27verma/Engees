import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ handleLogin, isAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a data object with username and password
    const data = { username, password };

    try {
      const response = await fetch("https://engeesserver.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      
      if (response.ok) {
        const res = await response.json();
        localStorage.setItem("token", res.token);
        handleLogin(res.token);
        setUsername("");
        setPassword("");
        navigate('/');
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
      // console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;

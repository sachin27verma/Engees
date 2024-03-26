import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Username, password, and confirm password are required.");
      return;
    }

    // Password validation using regex
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long."
      );
      return;
    }

    // Confirm password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    
    
    // Create data object for POST request

    const data = { username, password };

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Register successful
        console.log("User registered successfully");
        // Redirect to login page
        navigate('/login', { replace: true });
      } else {
        // Register failed
        console.error("Register failed");
        const responseData = await response.json(); // Parse error response if available
        if (responseData && responseData.errors) {
          setError(responseData.errors[0].msg); // Set error message from server validation
        } else {
          setError("Register failed. Please try again later."); // Default error message
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Register failed. Please try again later.");
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form className="formbc" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

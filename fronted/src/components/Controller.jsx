import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import '../App.css'; // Import CSS file

const Controller = ({ handleLogin, isAuthenticated }) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      {/* Fixed toggle buttons */}
      <div className="toggle-buttons">
        <button
          className={showLogin ? 'inactive' : 'active'}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>
        <button
          className={showLogin ? 'active' : 'inactive'}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
      </div>

      {/* Content container */}
      <div className="controller-container">
        <div className="form-container">
          {showLogin ? <Login handleLogin={handleLogin}
            isAuthenticated={isAuthenticated} /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default Controller;

import React from 'react';

const Home = ({ userData, handleLogout }) => {
  return (
    <div>
      <h2>Welcome to the home page, {userData && userData.username}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;

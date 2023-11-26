// Login.js

import React from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    // Navigate to the signup page when the signup button is clicked
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo">
          <img src="img/gurdian cloud white.png" alt="Your App Logo" />
        </div>
        <button className="signup-button" onClick={handleSignupClick}>
          Sign Up
        </button>
      </nav>
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <label>
            {" "}
            Don't have an account? <Link to="/signup">SignUp</Link>
          </label>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

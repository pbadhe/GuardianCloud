// Signup.js

import React from "react";
import "./Signup.css"; // Import your CSS file for styling
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigate to the signup page when the signup button is clicked
    navigate("/");
  };
  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo">
          <img src="img/gurdian cloud white.png" alt="Your App Logo" />
        </div>
        <button className="signup-button" onClick={handleLoginClick}>
          Login
        </button>
      </nav>
      <div className="login-box">
        <h2>Sign Up </h2>
        <form>
          <label>Name</label>
          <input type="name" placeholder="Enter your name" />
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <label> Confirm Password</label>
          <input type="password" placeholder="Confirm your password" />
          <label>
            {" "}
            Already have an account? <Link to="/">Login</Link>
          </label>

          <button type="submit">SignUp</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

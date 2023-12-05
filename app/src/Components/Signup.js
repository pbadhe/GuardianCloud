// Signup.js

import React, { useState } from "react";
import "./Signup.css"; // Import your CSS file for styling
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    request: "signup",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    // Add your password complexity rules here
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    // Check if password meets complexity requirements
    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, and one number."
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      // Check if the username already exists
      const usernameCheckResponse = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request: "ifexists",
            username: formData.username,
          }),
        }
      );

      if (usernameCheckResponse.ok) {
        const { "User Exists": userExists } =
          await usernameCheckResponse.json();

        if (userExists) {
          setPasswordError("Username already exists");
          return;
        }
      } else {
        console.error("Failed to check username existence");
        return;
      }

      // If the username does not exist, proceed with the signup
      const signupResponse = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (signupResponse.ok) {
        navigate("/");
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };
  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo">
          <img src="img/gurdian cloud white.png" alt="Your App Logo" />
        </div>
        <div className="rightSection">
          <div className="viewlink">View Shared Link </div>
          <button className="signup-button" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </nav>
      <div className="login-box">
        <h2>Sign Up </h2>
        <form onSubmit={handleSignupSubmit}>
          <label>Name</label>
          <input
            className="signup_input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
          <label>Username</label>
          <input
            className="signup_input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
          />
          <label>Email</label>
          <input
            className="signup_input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
          <label>Password</label>
          <input
            className="signup_input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
          <label> Confirm Password</label>
          <input
            className="signup_input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
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

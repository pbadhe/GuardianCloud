// Login.js

import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUid, setLogIn, setLogOut } from "../features/user/userSlice";
import { setBoolean } from "../features/Bool/boolSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    request: "login",
    username: "",
    password: "",
  });

  // State variable for error message
  const [error, setError] = useState("");

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Successful login, navigate to the dashboard or set some flag to show it
        dispatch(setLogIn({ uid: formData.username }));
        navigate("/drive/");
      } else {
        // Unsuccessful login, show error message
        dispatch(setLogOut({ uid: null, photo: null }));
        setError("Username or password is incorrect");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo">
          <img src="img/gurdian cloud white.png" alt="Your App Logo" />
        </div>
        <div className="rightSection">
          <div
            className="viewlink"
            onClick={() => dispatch(setBoolean({ viewLink: true }))}>
            View Shared Link{" "}
          </div>
          <button className="signup-button" onClick={handleSignupClick}>
            Sign Up
          </button>
        </div>
      </nav>
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <label>Username</label>
          <input
            className="login_input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter the username"
            required
          />
          <label>Password</label>
          <input
            className="login_input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
          <label>
            {" "}
            Don't have an account? <Link to="/signup">SignUp</Link>
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" onClick={handleLoginClick}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

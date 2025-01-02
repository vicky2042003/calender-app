import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1 className="homepage-title">Communication Tracker </h1>
      <div className="homepage-options">
        <div className="homepage-option" onClick={() => navigate("/user")}>
          <div className="option-icon">👤</div>
          <div className="option-text">User</div>
        </div>
        <div className="homepage-option" onClick={() => navigate("/admin")}>
          <div className="option-icon">🔧</div>
          <div className="option-text">Admin</div>
        </div>
        <div className="homepage-option" onClick={() => navigate("/reports")}>
          <div className="option-icon">📊</div>
          <div className="option-text">Report Module</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;


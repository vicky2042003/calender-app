import React from "react";
import "./Header.css"; // For header-specific styles

const Header = ({ title }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
    </div>
  );
};

export default Header;

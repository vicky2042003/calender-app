import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ links, title }) => {
  return (
    <div className="sidebar">
      <h2>{title}</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

import React from "react";
import Sidebar from "../Shared/Sidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const userLinks = [
    {name:"Home",path:"/"},
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Log Communication", path: "/user/log-communication" },
    { name: "Calendar", path: "/user/calendar" },
    { name: "Notifications", path: "/user/notifications" },
  ];

  return (
    <div className="layout">
      <Sidebar links={userLinks} title="User Options" />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;

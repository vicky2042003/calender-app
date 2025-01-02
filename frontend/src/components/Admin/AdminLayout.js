import React from "react";
import Sidebar from "../Shared/Sidebar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const adminLinks = [
    {name:"Home",path:"/"},
    { name: "Company List", path: "/admin/company-list" },
    { name: "Communication Method", path: "/admin/communication-method" },
  ];

  return (
    <div className="layout">
      <Sidebar links={adminLinks} title="Admin Options" />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

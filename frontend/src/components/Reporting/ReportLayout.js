import React from "react";
import Sidebar from "../Shared/Sidebar";
import { Outlet } from "react-router-dom";
import "./ReportLayout.css";

const ReportLayout = () => {
  const reportLinks = [
    {name:"Home",path:"/"},
    { name: "Frequency Report", path: "/reports/frequency" },
    { name: "Communication Trends", path: "/reports/overdue-trends" },
    { name: "Engagement Effectiveness", path: "/reports/effectiveness" },
    { name: "Activity Log", path: "/reports/activity-log" },
  ];

  return (
    <div className="report-layout">
      <Sidebar links={reportLinks} title="Report Options" />
      <div className="report-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ReportLayout;

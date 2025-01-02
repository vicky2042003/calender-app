import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/user/dashboard");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Last 5 Communications</th>
            <th>Next Scheduled Communication</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr key={index}>
              <td>{company.company_name}</td>
              <td>
                {company.last_five_communications.map((comm, idx) => (
                  <div key={idx}>
                    {comm.type} - {comm.date}
                  </div>
                ))}
              </td>
              <td>{company.next_scheduled_communication}</td>
              <td>
                {company.highlight === "red"
                  ? "Overdue"
                  : company.highlight === "yellow"
                    ? "Due Today"
                    : "On Track"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

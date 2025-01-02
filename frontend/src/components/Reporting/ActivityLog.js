import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { saveAs } from "file-saver";
import "./Reports.css";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [companies, setCompanies] = useState([]); // Store the list of companies
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    companyId: "", // Filter by company ID
  });

  useEffect(() => {
    fetchCompanies(); // Fetch the list of companies
    fetchActivityLog(); // Fetch initial activity logs
  }, []);

  // Fetch list of companies
  const fetchCompanies = async () => {
    try {
      const response = await api.get("/admin/companies");
      setCompanies(response.data); // Populate companies for dropdown
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Fetch activity log data
  const fetchActivityLog = async () => {
    try {
      const response = await api.get("/reports/activity-log", {
        params: filters,
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching activity log:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchActivityLog();
  };

  // Export Activity Log (CSV or PDF)
  const handleExport = async (format) => {
    try {
      const response = await api.get("/reports/activity-log/export", {
        params: { format },
        responseType: "blob", // Required for file download
      });
      const fileName = `activity_log.${format}`;
      saveAs(response.data, fileName); // Save file
    } catch (error) {
      console.error(`Error exporting activity log as ${format}:`, error);
    }
  };

  return (
    <div>
      <h1>Real-Time Activity Log</h1>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        {/* Company Dropdown */}
        <label>
          Company:
          <select
            name="companyId"
            value={filters.companyId}
            onChange={handleFilterChange}
          >
            <option value="">Select a Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </label>

        <button type="submit">Apply Filters</button>
      </form>

      {/* Export Buttons */}
      <div className="export-buttons">
        <button onClick={() => handleExport("csv")}>Export as CSV</button>
        <button onClick={() => handleExport("pdf")}>Export as PDF</button>
      </div>

      {/* Activity Log Table */}
      <table className="log-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Method</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.date}</td>
              <td>{log.company}</td>
              <td>{log.method}</td>
              <td>{log.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;

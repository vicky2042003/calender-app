import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/api";
import "./Reports.css";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const FrequencyReport = () => {
  const [chartData, setChartData] = useState(null);
  const [companies, setCompanies] = useState([]); // Store the list of companies
  const [filter, setFilter] = useState({
    companyId: "",
    startDate: "",
    endDate: "",
  });

  // Fetch the list of companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/user/companies");
        setCompanies(response.data); // Populate companies for dropdown
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
    fetchFrequencyData(); // Initial data fetch
  }, []);

  // Fetch frequency report data
  const fetchFrequencyData = async () => {
    try {
      const response = await api.get("/reports/communication-frequency", {
        params: filter,
      });
      const data = response.data;

      setChartData({
        labels: data.methods,
        datasets: [
          {
            label: "Communication Frequency",
            data: data.frequencies,
            backgroundColor: ["#33ffff", "#66ffff", "#99ffff", "#00ffff"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching frequency report:", error);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFrequencyData();
  };

  return (
    <div>
      <h1>Communication Frequency Report</h1>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        {/* Dropdown for Company Selection */}
        <label>
          Company:
          <select
            name="companyId"
            value={filter.companyId}
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
            value={filter.startDate}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />
        </label>

        <button type="submit">Apply Filters</button>
      </form>

      {/* Render the chart */}
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default FrequencyReport;

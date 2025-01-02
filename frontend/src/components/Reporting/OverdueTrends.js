import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import api from "../../services/api";
import "./Reports.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components for Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
);
const OverdueTrends = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchOverdueData();
  }, []);

  const fetchOverdueData = async () => {
    try {
      const response = await api.get("/reports/overdue-trends");
      const data = response.data;

      setChartData({
        labels: data.dates,
        datasets: [
          {
            label: "Communication Trends",
            data: data.overdue_counts,
            backgroundColor: "#33ffff",
            borderColor: "#00ffff",
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching overdue trends:", error);
    }
  };

  return (
    <div>
      <h1>Communication Trends</h1>
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default OverdueTrends;

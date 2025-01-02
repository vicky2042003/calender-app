import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../services/api";
import "./EngagementEffectivesness.css";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const EngagementEffectiveness = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchEffectivenessData();
  }, []);

  const fetchEffectivenessData = async () => {
    try {
      const response = await api.get("reports/engagement-effectiveness");
      const data = response.data;

      // Use distinct colors for each method
      const colors = [
        "#ff6384",
        "#36a2eb",
        "#ffcd56",
        "#4bc0c0",
        "#9966ff",
        "#ff9f40",
      ];

      setChartData({
        labels: data.methods,
        datasets: [
          {
            label: "Engagement Effectiveness",
            data: data.effectiveness,
            backgroundColor: colors.slice(0, data.methods.length), // Use as many colors as needed
            borderColor: "#ffffff", // White border for segments
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching effectiveness report:", error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize within container
    plugins: {
      legend: {
        position: "bottom", // Position legend at the bottom
      },
    },
  };

  return (
    <div className="engagement-effectiveness">
      <h1>Engagement Effectiveness</h1>
      <div className="chart-container">
        {chartData && <Pie data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default EngagementEffectiveness;

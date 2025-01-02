import React from "react";
import { saveAs } from "file-saver";
import api from "../../services/api";

const ExportButton = ({ reportType }) => {
  const handleExport = async () => {
    try {
      const response = await api.get(`/reports/export?type=${reportType}`, {
        responseType: "blob",
      });
      saveAs(response.data, `${reportType}_report.csv`);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  return <button onClick={handleExport}>Export as CSV</button>;
};

export default ExportButton;

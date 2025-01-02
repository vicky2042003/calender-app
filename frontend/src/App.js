import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import UserLayout from "./components/User/UserLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import ReportLayout from "./components/Reporting/ReportLayout";
import Dashboard from "./components/User/Dashboard";
import Calendar from "./components/User/Calendar";
import Notifications from "./components/User/Notifications";
import LogCommunication from "./components/User/LogCommunication";
import FrequencyReport from "./components/Reporting/FrequencyReport";
import OverdueTrends from "./components/Reporting/OverdueTrends";
import EngagementEffectiveness from "./components/Reporting/EngagementEffectiveness";
import ActivityLog from "./components/Reporting/ActivityLog";
import CompanyList from "./components/Admin/CompanyList";
import CommunicationMethod from "./components/Admin/CommunicationMethod";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="log-communication" element={<LogCommunication />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="company-list" element={<CompanyList />} />
          <Route
            path="communication-method"
            element={<CommunicationMethod />}
          />
        </Route>
        <Route path="/reports" element={<ReportLayout />}>
          <Route path="frequency" element={<FrequencyReport />} />
          <Route path="overdue-trends" element={<OverdueTrends />} />
          <Route path="effectiveness" element={<EngagementEffectiveness />} />
          <Route path="activity-log" element={<ActivityLog />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

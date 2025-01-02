import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./LogCommunication.css";

const LogCommunication = () => {
  const [companies, setCompanies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await api.get("/admin/companies");
        const methodResponse = await api.get("/admin/communication-methods");
        setCompanies(companyResponse.data);
        setMethods(methodResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/log-communication", {
        company_id: selectedCompany,
        method_id: selectedMethod,
        date,
        notes,
      });
      alert("Communication logged successfully!");
      setSelectedCompany("");
      setSelectedMethod("");
      setDate("");
      setNotes("");
    } catch (error) {
      console.error("Error logging communication:", error);
    }
  };

  return (
    <div>
      <h1>Log Communication</h1>
      <form onSubmit={handleSubmit} className="log-communication-form">
        <label>
          Company:
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Communication Method:
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <option value="">Select Method</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <button type="submit">Log Communication</button>
      </form>
    </div>
  );
};

export default LogCommunication;

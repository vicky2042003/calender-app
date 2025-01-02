import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./CompanyList.css";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    linkedin_profile: "",
    emails: "",
    phone_numbers: "",
    comments: "",
    communication_periodicity: "",
  });

  // Fetch company data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/admin/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await api.delete("/admin/companies", { data: { id } });
        setCompanies(companies.filter((company) => company.id !== id));
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  // Open modal for add or edit
  const openModal = (company = null) => {
    if (company) {
      setFormData({ ...company });
      setIsEditing(true);
      setSelectedCompany(company.id);
    } else {
      setFormData({
        name: "",
        location: "",
        linkedin_profile: "",
        emails: "",
        phone_numbers: "",
        comments: "",
        communication_periodicity: "",
      });
      setIsEditing(false);
      setSelectedCompany(null);
    }
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put("/admin/companies", { ...formData, id: selectedCompany });
        alert("Company updated successfully!");
      } else {
        await api.post("/admin/companies", formData);
        alert("Company added successfully!");
      }
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedCompany(null);
      const response = await api.get("/admin/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h1>Company List</h1>
      <button className="add-button" onClick={() => openModal()}>
        Add New Company
      </button>

      <table className="company-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.location}</td>
              <td>
                <button onClick={() => openModal(company)}>✏️</button>
                <button onClick={() => handleDelete(company.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? "Edit Company" : "Add Company"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                LinkedIn Profile:
                <input
                  type="text"
                  value={formData.linkedin_profile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      linkedin_profile: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Emails:
                <input
                  type="text"
                  value={formData.emails}
                  onChange={(e) =>
                    setFormData({ ...formData, emails: e.target.value })
                  }
                />
              </label>
              <label>
                Phone Numbers:
                <input
                  type="text"
                  value={formData.phone_numbers}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_numbers: e.target.value })
                  }
                />
              </label>
              <label>
                Comments:
                <textarea
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                ></textarea>
              </label>
              <label>
                Communication Periodicity:
                <input
                  type="text"
                  value={formData.communication_periodicity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      communication_periodicity: e.target.value,
                    })
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="submit">
                  {isEditing ? "Update Company" : "Add Company"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;

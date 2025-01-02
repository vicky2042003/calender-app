import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./CommunicationMethod.css";

const CommunicationMethod = () => {
  const [methods, setMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sequence: "",
    mandatory: false,
  });

  // Fetch communication methods
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await api.get("/admin/communication-methods");
        setMethods(response.data);
      } catch (error) {
        console.error("Error fetching methods:", error);
      }
    };
    fetchMethods();
  }, []);

  // Handle modal open
  const openModal = () => {
    setFormData({
      name: "",
      description: "",
      sequence: "",
      mandatory: false,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/communication-methods", formData);
      alert("Communication method added successfully!");
      setIsModalOpen(false);
      const response = await api.get("/admin/communication-methods");
      setMethods(response.data);
    } catch (error) {
      console.error("Error adding communication method:", error);
    }
  };

  return (
    <div>
      <h1>Communication Methods</h1>
      <button className="add-button" onClick={openModal}>
        Add New Method
      </button>

      <table className="method-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Sequence</th>
            <th>Mandatory</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((method) => (
            <tr key={method.id}>
              <td>{method.name}</td>
              <td>{method.description}</td>
              <td>{method.sequence}</td>
              <td>{method.mandatory ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Communication Method</h2>
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
                Description:
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                ></textarea>
              </label>
              <label>
                Sequence:
                <input
                  type="number"
                  value={formData.sequence}
                  onChange={(e) =>
                    setFormData({ ...formData, sequence: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Mandatory:
                <input
                  type="checkbox"
                  checked={formData.mandatory}
                  onChange={(e) =>
                    setFormData({ ...formData, mandatory: e.target.checked })
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Add Method</button>
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

export default CommunicationMethod;

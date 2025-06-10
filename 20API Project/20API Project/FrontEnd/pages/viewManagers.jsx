import React, { useEffect, useState } from "react";
import axios from "axios";

function AllManagers() {
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = () => {
    axios
      .get("http://localhost:8888/all-managers")
      .then((res) => {
        if (res.data.success) {
          setManagers(res.data.managers);
          setError("");
        } else {
          setError("Failed to fetch managers.");
        }
      })
      .catch(() => {
        setError("Something went wrong while fetching data.");
      });
  };

  const handleDelete = (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?"))
      return;

    axios
      .delete(`http://localhost:8888/delete-manager/${managerId}`)
      .then((res) => {
        if (res.data.success) {
          setSuccess("Manager deleted successfully.");
          fetchManagers();
        } else {
          setError("Failed to delete manager.");
        }
      })
      .catch(() => {
        setError("Error occurred while deleting manager.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Managers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="table-responsive">
        <table className="table table-striped shadow">
          <thead className="table-dark">
            <tr>
              <th>Manager's Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Admin Name</th>
              <th>Admin Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager._id}>
                <td>{manager.username}</td>
                <td>{manager.email}</td>
                <td>{manager.phone}</td>
                <td>{manager.adminId?.name || "N/A"}</td>
                <td>{manager.adminId?.email || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(manager._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllManagers;

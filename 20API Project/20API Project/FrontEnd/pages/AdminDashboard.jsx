import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [message, setMessage] = useState("Loading...");
  const [showForm, setShowForm] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromURL = queryParams.get("email");

    if (!emailFromURL) {
      setMessage("No user email found in URL.");
      return;
    }

    axios
      .get(`http://localhost:8888/dashboard?email=${emailFromURL}`)
      .then((res) => {
        if (res.data.success && res.data.role.toLowerCase() === "admin") {
          setMessage(`Hello Admin - ${res.data.name}`);
          setAdminId(res.data._id || null);
        } else {
          setMessage("Access denied. You are not an admin.");
        }
      })
      .catch(() => {
        setMessage("Error fetching dashboard data.");
      });
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setFeedback("");
    setUsername("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleAddManager = (e) => {
    e.preventDefault();

    if (!username || !email || !phone || !password) {
      setFeedback("Please fill all fields.");
      return;
    }

    if (!adminId) {
      setFeedback("Admin ID not found. Cannot add manager.");
      return;
    }

    axios
      .post("http://localhost:8888/add-manager", {
        username,
        email,
        phone,
        password,
        adminId,
        role: "manager",
      })
      .then((res) => {
        if (res.data.success) {
          setFeedback("Manager added successfully!");
          setShowForm(false);
          setUsername("");
          setEmail("");
          setPhone("");
          setPassword("");
        } else {
          setFeedback(
            "Failed to add manager: " + (res.data.msg || "Unknown error")
          );
        }
      })
      .catch(() => {
        setFeedback("Error adding manager. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-3 text-center bg-light mb-4">
        <h2 style={{ textTransform: "capitalize" }}>{message}</h2>
      </div>

      {message.toLowerCase().includes("admin") && (
        <>
          <div className="mb-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={toggleForm}>
              {showForm ? "Cancel" : "Add Manager"}
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => (window.location.href = "/all-managers")}
            >
              View All Managers
            </button>
          </div>

          {showForm && (
            <div className="card p-4 shadow">
              <h4>Add Manager</h4>
              <form onSubmit={handleAddManager}>
                <div className="mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Add Manager
                </button>
              </form>

              {feedback && (
                <div className="mt-3 alert alert-info" role="alert">
                  {feedback}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;

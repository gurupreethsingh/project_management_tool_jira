import React, { useState, useEffect } from "react";
import axios from "axios";

const GetAllAttendence = () => {
  const [allAttendence, setAllAttendence] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllAttendence = async () => {
      try {
        const token = localStorage.getItem("userToken"); // ⬅️ Make sure token is stored on login

        const response = await axios.get("http://localhost:5000/api/get-all-attendence", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllAttendence(response.data || []);
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error("Fetch error:", err);
      }
    };

    fetchAllAttendence();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">All Employee Attendance Records</h2>

      {error && <p className="text-danger">{error}</p>}

      <div className="all-employee-attendence container m-5 p-5 card">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {allAttendence.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            allAttendence.map((eachperson_attendence, index) => (
              <div className="col" key={index}>
                <div className="card h-100">
                  <img
                    src={eachperson_attendence.employee?.avatar || "/default.png"}
                    className="card-img-top"
                    alt="employee"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {eachperson_attendence.employee?.name || "Unknown"}
                    </h5>
                    <p className="card-text">
                      <strong>Project:</strong> {eachperson_attendence.project?.project_name || "N/A"}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong> {new Date(eachperson_attendence.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Hours:</strong> {eachperson_attendence.hoursWorked}
                    </p>
                    <p className="card-text">
                      <strong>Task:</strong> {eachperson_attendence.taskDescription}
                    </p>
                    <p className="card-text">
                      <strong>Shift:</strong> {eachperson_attendence.shift}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {eachperson_attendence.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllAttendence;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }
    EmployeeService.getEmployeeById(employeeId)
      .then(res => setEmployee(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-5 pt-5 text-center text-white">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="mt-5 pt-4">
      <div className="container">
        <div className="card w-50 offset-3 p-4 shadow">

          {/* Profile Header */}
          <div className="text-center mb-4">
            <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "80px", height: "80px" }}>
              <span className="text-white fw-bold fs-2">
                {employee?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="fw-bold">{employee?.name}</h4>
            <span className="badge bg-success">{employee?.dept?.designation}</span>
          </div>

          <hr />

          {/* Employee Details */}
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-light rounded">
                <small className="text-muted d-block">Employee ID</small>
                <strong>#{employee?.id}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded">
                <small className="text-muted d-block">Date of Joining</small>
                <strong>{employee?.doj}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded">
                <small className="text-muted d-block">Department</small>
                <strong>{employee?.dept?.deptName}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded">
                <small className="text-muted d-block">Designation</small>
                <strong>{employee?.dept?.designation}</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-muted small">
              👋 Welcome, <strong>{name}</strong>! This is your profile page.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;

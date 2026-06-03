import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

function UpdateEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [doj, setDoj] = useState("");           // stored as yyyy-MM-dd for HTML date input
  const [department, setDepartment] = useState({ deptName: "", designation: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /**
   * BUG FIX: Original UpdateEmployee used a plain text input for DOJ.
   * This makes editing dates confusing and error-prone.
   * We parse the dd-MM-yyyy from the API back into yyyy-MM-dd for
   * the HTML date picker, then convert back on submit.
   */
  const parseApiDate = (ddMMYYYY) => {
    if (!ddMMYYYY) return "";
    const parts = ddMMYYYY.split("-");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // → yyyy-MM-dd
  };

  const formatForApi = (yyyyMMDD) => {
    if (!yyyyMMDD) return "";
    const d = new Date(yyyyMMDD);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    EmployeeService.getEmployeeById(id)
      .then(res => {
        setName(res.data.name);
        setDoj(parseApiDate(res.data.doj));
        setDepartment({
          deptName: res.data.dept?.deptName || "",
          designation: res.data.dept?.designation || "",
        });
      })
      .catch(err => {
        console.error("Error fetching employee:", err);
        alert("Employee not found.");
        navigate("/");
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name.trim() || !doj || !department.deptName.trim() || !department.designation.trim()) {
      alert("All fields are required.");
      return;
    }
    setLoading(true);
    const updatedEmployee = {
      name,
      doj: formatForApi(doj),
      dept: {
        deptName: department.deptName,
        designation: department.designation,
      },
    };
    EmployeeService.updateEmployee(id, updatedEmployee)
      .then(() => navigate("/"))
      .catch(err => {
        console.error("Error updating employee:", err);
        alert("Failed to update employee. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="mt-5 pt-5 text-center text-white">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="mt-5 pt-4">
      <div className="container">
        <div className="card offset-3 w-50 p-4 shadow">
          <h5 className="text-center mb-4">Update Employee</h5>
          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Name:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Date of Joining:</label>
              <input
                type="date"
                name="doj"
                className="form-control"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Department:</label>
              <input
                type="text"
                name="deptName"
                className="form-control"
                value={department.deptName}
                onChange={(e) => setDepartment({ ...department, deptName: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Designation:</label>
              <input
                type="text"
                name="designation"
                className="form-control"
                value={department.designation}
                onChange={(e) => setDepartment({ ...department, designation: e.target.value })}
              />
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateEmployee;

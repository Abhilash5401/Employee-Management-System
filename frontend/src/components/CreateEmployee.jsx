import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../services/EmployeeService";

function CreateEmployee() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState({
    name: "",
    doj: "",
    username: "",
    password: "",
    dept: {
      deptName: "",
      designation: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "doj" || name === "username" || name === "password") {
      setEmployees({ ...employees, [name]: value });
    } else {
      setEmployees({ ...employees, dept: { ...employees.dept, [name]: value } });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const dateFormat = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validate = () => {
    const formErrors = {};
    let isValid = true;
    if (!employees.name.trim()) { formErrors.name = "Name is mandatory"; isValid = false; }
    if (!employees.doj) { formErrors.doj = "Date of joining is mandatory"; isValid = false; }
    if (!employees.dept.deptName.trim()) { formErrors.deptName = "Department is mandatory"; isValid = false; }
    if (!employees.dept.designation.trim()) { formErrors.designation = "Designation is mandatory"; isValid = false; }
    if (!employees.username.trim()) { formErrors.username = "Username is mandatory"; isValid = false; }
    if (!employees.password.trim()) { formErrors.password = "Password is mandatory"; isValid = false; }
    else if (employees.password.length < 6) { formErrors.password = "Password must be at least 6 characters"; isValid = false; }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const employeeData = {
        ...employees,
        doj: dateFormat(employees.doj),
      };
      EmployeeService.addEmployee(employeeData)
        .then(() => navigate("/"))
        .catch(err => {
          console.error("Error adding employee:", err);
          alert("Failed to add employee. Username may already exist.");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="mt-5 pt-4">
      <div className="container">
        <div className="card w-50 offset-3 p-4 shadow">
          <h5 className="text-center mb-4">Add New Employee</h5>
          <form>

            <div className="mb-3">
              <label className="form-label fw-semibold">Name:</label>
              <input type="text" name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={employees.name} onChange={handleChange} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Date of Joining:</label>
              <input type="date" name="doj"
                className={`form-control ${errors.doj ? "is-invalid" : ""}`}
                value={employees.doj} onChange={handleChange} />
              {errors.doj && <div className="invalid-feedback">{errors.doj}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Department:</label>
              <input type="text" name="deptName"
                className={`form-control ${errors.deptName ? "is-invalid" : ""}`}
                value={employees.dept.deptName} onChange={handleChange} />
              {errors.deptName && <div className="invalid-feedback">{errors.deptName}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Designation:</label>
              <input type="text" name="designation"
                className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                value={employees.dept.designation} onChange={handleChange} />
              {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
            </div>

            <hr />
            <p className="text-muted small mb-2">🔐 Employee Login Credentials</p>

            <div className="mb-3">
              <label className="form-label fw-semibold">Username:</label>
              <input type="text" name="username"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                value={employees.username} onChange={handleChange} />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password:</label>
              <input type="password" name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={employees.password} onChange={handleChange} />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
              <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEmployee;

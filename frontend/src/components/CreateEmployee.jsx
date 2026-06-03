import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../services/EmployeeService";

function CreateEmployee() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState({
    name: "",
    doj: "",
    dept: {
      deptName: "",
      designation: "",
    },
  });

  const [errors, setErrors] = useState({
    name: "",
    doj: "",
    deptName: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "doj") {
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

  // Convert yyyy-MM-dd (HTML date input) → dd-MM-yyyy (backend format)
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

    if (!employees.name.trim()) {
      formErrors.name = "Name is mandatory";
      isValid = false;
    }
    if (!employees.doj) {
      formErrors.doj = "Date of joining is mandatory";
      isValid = false;
    }
    if (!employees.dept.deptName.trim()) {
      formErrors.deptName = "Department name is mandatory";
      isValid = false;
    }
    if (!employees.dept.designation.trim()) {
      formErrors.designation = "Designation is mandatory";
      isValid = false;
    }
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
          alert("Failed to add employee. Please try again.");
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
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={employees.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Date of Joining:</label>
              <input
                type="date"
                id="doj"
                name="doj"
                className={`form-control ${errors.doj ? "is-invalid" : ""}`}
                value={employees.doj}
                onChange={handleChange}
              />
              {errors.doj && <div className="invalid-feedback">{errors.doj}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Department:</label>
              <input
                type="text"
                id="deptName"
                name="deptName"
                className={`form-control ${errors.deptName ? "is-invalid" : ""}`}
                value={employees.dept.deptName}
                onChange={handleChange}
              />
              {errors.deptName && <div className="invalid-feedback">{errors.deptName}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Designation:</label>
              <input
                type="text"
                id="designation"
                name="designation"
                className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                value={employees.dept.designation}
                onChange={handleChange}
              />
              {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
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

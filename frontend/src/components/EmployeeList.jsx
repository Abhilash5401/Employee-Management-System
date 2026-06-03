import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import EmployeeService from '../services/EmployeeService';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const [value] = useTypewriter({
    words: ["Details", "Information", "List"],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 120,
  });

  const loadEmployees = () => {
    EmployeeService.getAllEmployees()
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Error loading employees:", err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /**
   * BUG FIX: Original code used employees.map(employees => ...) with wrong
   * variable name and missing return statement. Fixed to emp => return <tr>
   */
  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      EmployeeService.deleteEmployee(id)
        .then(() => loadEmployees())
        .catch(err => console.error("Error deleting employee:", err));
    }
  };

  return (
    <div className="mt-5">
      <h3 className="mt-5 text-center pt-3 text-white">
        Employee {value} <Cursor />
      </h3>
      <div className="container mt-4">
        <Link to="/add-emp" className="btn btn-success mb-3">
          + Add Employee
        </Link>
        <div className="card shadow">
          <table className="table table-bordered table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>DOJ</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No employees found. Click "Add Employee" to get started.
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.doj}</td>
                    <td>{emp.dept?.deptName}</td>
                    <td>{emp.dept?.designation}</td>
                    <td>
                      <Link
                        to={`/update-emp/${emp.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteEmployee(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;

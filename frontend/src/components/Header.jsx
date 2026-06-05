import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("logged");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("employeeId");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <a href="/" className="navbar-brand fw-bold text-primary">
          BridgeSoft EMS
        </a>
        {localStorage.getItem("logged") && (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">
              👤 <strong>{name}</strong>
              <span className={`badge ms-2 ${role === "ADMIN" ? "bg-danger" : "bg-success"}`}>
                {role}
              </span>
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;

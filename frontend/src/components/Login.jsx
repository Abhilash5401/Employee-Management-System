import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.username || !user.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError("");
    AuthService.login(user)
      .then(res => {
        if (res.data === true) {
          localStorage.setItem("logged", "true");
          navigate("/");
        } else {
          setError("Invalid Username or Password.");
        }
      })
      .catch(() => {
        setError("Server error. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-5 pt-5">
      <div className="card p-5 w-50 offset-3 shadow">
        <h3 className="text-center mb-4">Login</h3>
        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username:</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

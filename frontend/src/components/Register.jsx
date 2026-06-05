import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AUTH_API = "https://ravishing-ambition-production-5ef5.up.railway.app/api/auth/register";

function Register() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "", secretKey: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const formErrors = {};
    let isValid = true;

    if (!form.username.trim()) {
      formErrors.username = "Username is required";
      isValid = false;
    }
    if (!form.password || form.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (form.password !== form.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!form.secretKey.trim()) {
      formErrors.secretKey = "Secret key is required";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    axios.post(AUTH_API, {
      username: form.username,
      password: form.password,
      secretKey: form.secretKey
    })
      .then(res => {
        if (res.data.success) {
          setSuccess("Admin account created successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setErrors({ secretKey: res.data.message });
        }
      })
      .catch(() => setErrors({ secretKey: "Server error. Please try again." }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-5 pt-5">
      <div className="card p-5 w-50 offset-3 shadow">
        <h3 className="text-center mb-2">Admin Registration</h3>
        <p className="text-center text-muted small mb-4">
          🔐 Requires a secret key provided by the backend developer
        </p>

        {success && <div className="alert alert-success">{success}</div>}

        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username:</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              autoComplete="off"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">🔑 Secret Key:</label>
            <input
              type="password"
              name="secretKey"
              className={`form-control ${errors.secretKey ? "is-invalid" : ""}`}
              placeholder="Contact backend developer for this key"
              value={form.secretKey}
              onChange={handleChange}
            />
            {errors.secretKey && <div className="invalid-feedback">{errors.secretKey}</div>}
          </div>

          <button
            className="btn btn-primary w-100 mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>

          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/login">Login here</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

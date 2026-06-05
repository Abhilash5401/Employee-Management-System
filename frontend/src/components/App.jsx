import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import CreateEmployee from "./components/CreateEmployee";
import EmployeeList from "./components/EmployeeList";
import UpdateEmployee from "./components/UpdateEmployee";
import EmployeeProfile from "./components/EmployeeProfile";
import './App.css';

// Only Admin can access
function AdminRoute({ children }) {
  const logged = localStorage.getItem("logged");
  const role = localStorage.getItem("role");
  if (!logged) return <Navigate to="/login" />;
  if (role !== "ADMIN") return <Navigate to="/my-profile" />;
  return children;
}

// Only logged in employees can access
function EmployeeRoute({ children }) {
  const logged = localStorage.getItem("logged");
  const role = localStorage.getItem("role");
  if (!logged) return <Navigate to="/login" />;
  if (role !== "EMPLOYEE") return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <div className="bg-color">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin only routes */}
          <Route path="/" element={<AdminRoute><EmployeeList /></AdminRoute>} />
          <Route path="/add-emp" element={<AdminRoute><CreateEmployee /></AdminRoute>} />
          <Route path="/update-emp/:id" element={<AdminRoute><UpdateEmployee /></AdminRoute>} />

          {/* Employee only route */}
          <Route path="/my-profile" element={<EmployeeRoute><EmployeeProfile /></EmployeeRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

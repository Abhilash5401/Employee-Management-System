import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import CreateEmployee from "./components/CreateEmployee";
import EmployeeList from "./components/EmployeeList";
import UpdateEmployee from "./components/UpdateEmployee";
import './App.css';

function PrivateRoute({ children }) {
  return localStorage.getItem("logged") ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="bg-color">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/add-emp" element={<PrivateRoute><CreateEmployee /></PrivateRoute>} />
          <Route path="/update-emp/:id" element={<PrivateRoute><UpdateEmployee /></PrivateRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

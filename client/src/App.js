import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServicesList from "./pages/ServicesList";
import AddService from "./pages/AddService";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<ServicesList />} />
        <Route
          path="/add-service"
          element={
            <ProtectedRoute>
              <AddService />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

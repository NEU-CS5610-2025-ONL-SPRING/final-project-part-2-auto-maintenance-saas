import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServicesList from "./pages/ServicesList";
import AddService from "./pages/AddService";
import VehicleSearch from "./pages/VehicleSearch";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // You can customize this color
    },
    secondary: {
      main: "#dc004e", // You can customize this color
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline /> {/* This provides consistent baseline styles */}
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<ServicesList />} />
              <Route path="/vehicles" element={<VehicleSearch />} />

              {/* Protected Routes - User */}
              <Route
                path="/book-appointment"
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/add-service"
                element={
                  <AdminRoute>
                    <AddService />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServicesList from "./pages/ServicesList";
import AddService from "./pages/AddService";

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
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This provides consistent baseline styles */}
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
    </ThemeProvider>
  );
}

export default App;

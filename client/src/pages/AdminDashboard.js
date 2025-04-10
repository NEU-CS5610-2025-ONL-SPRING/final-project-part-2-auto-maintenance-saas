import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { API_ENDPOINTS } from "../config";
import { handleApiError, displayError } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.APPOINTMENTS.ALL, {
          credentials: "include",
        });
        const data = await handleApiError(response);
        setAppointments(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setStatusUpdating((prev) => ({ ...prev, [appointmentId]: true }));
      const response = await fetch(
        API_ENDPOINTS.APPOINTMENTS.STATUS(appointmentId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );

      const updatedAppointment = await handleApiError(response);
      setAppointments((prev) =>
        prev.map((app) => (app.id === appointmentId ? updatedAppointment : app))
      );
    } catch (err) {
      displayError(err, setError);
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "info";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);

    switch (selectedTab) {
      case 0: // All
        return true;
      case 1: // Today
        return (
          appointmentDate.getDate() === today.getDate() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear()
        );
      case 2: // Upcoming
        return appointmentDate > today;
      case 3: // Past
        return appointmentDate < today;
      case 4: // Pending
        return appointment.status === "PENDING";
      case 5: // Confirmed
        return appointment.status === "CONFIRMED";
      case 6: // Completed
        return appointment.status === "COMPLETED";
      case 7: // Cancelled
        return appointment.status === "CANCELLED";
      default:
        return true;
    }
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="appointment tabs"
          >
            <Tab label="All" />
            <Tab label="Today" />
            <Tab label="Upcoming" />
            <Tab label="Past" />
            <Tab label="Pending" />
            <Tab label="Confirmed" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
        </Paper>

        <Paper elevation={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : filteredAppointments.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography variant="body1">
                No appointments found for this filter.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.user.email}</TableCell>
                      <TableCell>{appointment.service.name}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), "PPp")}
                      </TableCell>
                      <TableCell>{appointment.carModel}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={getStatusChipColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${appointment.service.price}</TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={appointment.status}
                            onChange={(e) =>
                              handleStatusChange(appointment.id, e.target.value)
                            }
                            disabled={statusUpdating[appointment.id]}
                            size="small"
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

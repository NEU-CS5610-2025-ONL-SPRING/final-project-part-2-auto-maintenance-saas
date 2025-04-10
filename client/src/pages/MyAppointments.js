import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_ENDPOINTS } from "../config";
import { handleApiError, displayError } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";

export default function MyAppointments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.APPOINTMENTS.LIST, {
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

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  const openDeleteDialog = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const deleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(
        API_ENDPOINTS.APPOINTMENTS.DELETE(appointmentToDelete.id),
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setAppointments((prev) =>
          prev.filter((a) => a.id !== appointmentToDelete.id)
        );
      } else {
        await handleApiError(response);
      }
      closeDeleteDialog();
    } catch (err) {
      displayError(err, setError);
    } finally {
      setDeleteLoading(false);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h3" component="h1">
            My Appointments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleBookAppointment}
          >
            Book New Appointment
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : appointments.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography variant="body1" gutterBottom>
                You don't have any appointments yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleBookAppointment}
                sx={{ mt: 2 }}
              >
                Book Your First Appointment
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
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
                      <TableCell align="right">
                        {appointment.status === "PENDING" && (
                          <Button
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => openDeleteDialog(appointment)}
                            size="small"
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Cancel Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your{" "}
            {appointmentToDelete?.service?.name} appointment on{" "}
            {appointmentToDelete
              ? format(new Date(appointmentToDelete.date), "PPp")
              : ""}
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteLoading}>
            Keep Appointment
          </Button>
          <Button
            onClick={deleteAppointment}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

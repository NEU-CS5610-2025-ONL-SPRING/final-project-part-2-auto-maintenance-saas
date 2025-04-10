import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { API_ENDPOINTS } from "../config";
import { handleApiError, displayError } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";
import format from "date-fns/format";

export default function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [carModel, setCarModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.SERVICES.LIST);
        const data = await handleApiError(response);
        setServices(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Update selected service when selectedServiceId changes
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(
        (s) => s.id === parseInt(selectedServiceId)
      );
      setSelectedService(service);
      setTotalCost(service ? service.price : 0);
    } else {
      setSelectedService(null);
      setTotalCost(0);
    }
  }, [selectedServiceId, services]);

  // Fetch time slots when service and date are selected
  useEffect(() => {
    if (!selectedServiceId || !selectedDate) {
      setTimeSlots([]);
      return;
    }

    const fetchTimeSlots = async () => {
      try {
        setLoadingTimeSlots(true);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `${API_ENDPOINTS.APPOINTMENTS.TIME_SLOTS}?date=${formattedDate}&serviceId=${selectedServiceId}`
        );
        const data = await handleApiError(response);
        setTimeSlots(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    fetchTimeSlots();
  }, [selectedServiceId, selectedDate]);

  const handleServiceChange = (event) => {
    setSelectedServiceId(event.target.value);
    setSelectedTimeSlot("");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot("");
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  const handleCarModelChange = (event) => {
    setCarModel(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return !!selectedServiceId;
      case 1:
        return !!selectedDate && !!selectedTimeSlot;
      case 2:
        return !!carModel;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_ENDPOINTS.APPOINTMENTS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          date: selectedTimeSlot,
          carModel,
        }),
        credentials: "include",
      });

      await handleApiError(response);

      // Navigate to appointments page on success
      navigate("/appointments");
    } catch (err) {
      displayError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Select Service",
    "Choose Date & Time",
    "Vehicle Information",
    "Confirmation",
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Book an Appointment
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select a Service
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="service-select-label">Service</InputLabel>
                <Select
                  labelId="service-select-label"
                  id="service-select"
                  value={selectedServiceId}
                  label="Service"
                  onChange={handleServiceChange}
                  disabled={loading}
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedService && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6">{selectedService.name}</Typography>
                    <Typography variant="body1">
                      Price: ${selectedService.price}
                    </Typography>
                    <Typography variant="body2">
                      Duration: {selectedService.duration} minutes
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Date and Time
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ mb: 3 }} />
                  )}
                  disablePast
                  shouldDisableDate={(date) =>
                    date.getDay() === 0 || date.getDay() === 6
                  } // Disable weekends
                />
              </LocalizationProvider>

              {selectedDate && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="time-slot-label">Time Slot</InputLabel>
                  <Select
                    labelId="time-slot-label"
                    id="time-slot-select"
                    value={selectedTimeSlot}
                    label="Time Slot"
                    onChange={handleTimeSlotChange}
                    disabled={loadingTimeSlots}
                  >
                    {loadingTimeSlots ? (
                      <MenuItem value="">
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : timeSlots.length === 0 ? (
                      <MenuItem value="" disabled>
                        No available time slots
                      </MenuItem>
                    ) : (
                      timeSlots.map((slot) => {
                        const date = new Date(slot.time);
                        return (
                          <MenuItem key={slot.time} value={slot.time}>
                            {format(date, "h:mm a")}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Vehicle Information
              </Typography>
              <TextField
                fullWidth
                label="Car Make and Model"
                variant="outlined"
                value={carModel}
                onChange={handleCarModelChange}
                placeholder="e.g., Honda Civic 2020"
                sx={{ mb: 3 }}
              />
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Appointment Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Service:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedService?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Date & Time:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedDate && selectedTimeSlot
                      ? format(new Date(selectedTimeSlot), "PPpp")
                      : "Not selected"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Vehicle:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {carModel}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Duration:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedService?.duration} minutes
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" color="primary" align="right">
                Total Cost: ${totalCost.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
              sx={{ mr: 1 }}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>
            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              disabled={!isStepValid() || loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {activeStep === steps.length - 1 ? "Book Appointment" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

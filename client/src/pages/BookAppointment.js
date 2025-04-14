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
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);

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

  // Fetch car makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        const response = await fetch(API_ENDPOINTS.VEHICLES.COMMON_MAKES);
        const data = await handleApiError(response);
        setMakes(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await fetch(
          API_ENDPOINTS.VEHICLES.COMMON_MODELS(selectedMake)
        );
        const data = await handleApiError(response);
        setModels(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedMake]);

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

  // Add year range generation on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from(
      { length: currentYear - 2000 + 2 }, // +2 to include current year and next year
      (_, i) => (currentYear + 1 - i).toString()
    );
    setYears(yearRange);
  }, []);

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

  const handleMakeChange = (event) => {
    setSelectedMake(event.target.value);
    setSelectedModel("");
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
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
        return !!selectedMake && !!selectedModel && !!selectedYear;
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
          carModel: `${selectedYear} ${selectedMake} ${selectedModel}`,
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
                  {loading ? (
                    <MenuItem value="">
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </MenuItem>
                    ))
                  )}
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
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  label="Year"
                  onChange={handleYearChange}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="make-select-label">Car Make</InputLabel>
                <Select
                  labelId="make-select-label"
                  id="make-select"
                  value={selectedMake}
                  label="Car Make"
                  onChange={handleMakeChange}
                  disabled={loadingMakes}
                >
                  {loadingMakes ? (
                    <MenuItem value="">
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    makes.map((make) => (
                      <MenuItem key={make.Make_ID} value={make.Make_Name}>
                        {make.Make_Name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="model-select-label">Car Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  label="Car Model"
                  onChange={handleModelChange}
                  disabled={!selectedMake || loadingModels}
                >
                  {loadingModels ? (
                    <MenuItem value="">
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    models.map((model) => (
                      <MenuItem key={model.Model_ID} value={model.Model_Name}>
                        {model.Model_Name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Confirmation
              </Typography>
              <Typography variant="body1" paragraph>
                Please review your appointment details:
              </Typography>
              <Typography variant="body1">
                Service: {selectedService?.name}
              </Typography>
              <Typography variant="body1">
                Date: {selectedDate && format(selectedDate, "MMMM do, yyyy")}
              </Typography>
              <Typography variant="body1">
                Time:{" "}
                {selectedTimeSlot &&
                  format(new Date(selectedTimeSlot), "h:mm a")}
              </Typography>
              <Typography variant="body1">
                Vehicle: {selectedYear} {selectedMake} {selectedModel}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                Total Cost: ${totalCost}
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

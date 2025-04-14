import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SearchIcon from "@mui/icons-material/Search";
import { API_ENDPOINTS } from "../config";
import { handleApiError, displayError } from "../utils/errorHandler";

export default function VehicleSearch() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [vin, setVin] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showAllMakes, setShowAllMakes] = useState(false);

  // Fetch car makes on component mount or when showAllMakes changes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        const endpoint = showAllMakes
          ? API_ENDPOINTS.VEHICLES.MAKES
          : API_ENDPOINTS.VEHICLES.COMMON_MAKES;

        const response = await fetch(endpoint);
        const data = await handleApiError(response);
        setMakes(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, [showAllMakes]);

  // Fetch models when a make is selected
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const endpoint = showAllMakes
          ? API_ENDPOINTS.VEHICLES.MODELS(selectedMake)
          : API_ENDPOINTS.VEHICLES.COMMON_MODELS(selectedMake);

        const response = await fetch(endpoint);
        const data = await handleApiError(response);
        setModels(data);
      } catch (err) {
        displayError(err, setError);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedMake, showAllMakes]);

  const handleMakeChange = (event) => {
    setSelectedMake(event.target.value);
    setSelectedModel("");
    setVehicleDetails(null);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setVehicleDetails(null);
  };

  const handleVinChange = (event) => {
    setVin(event.target.value);
  };

  const handleShowAllMakesChange = (event) => {
    setShowAllMakes(event.target.checked);
    setSelectedMake("");
    setSelectedModel("");
    setVehicleDetails(null);
  };

  const searchByVin = async () => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_ENDPOINTS.VEHICLES.VIN(vin));
      const data = await handleApiError(response);

      // Process the data to make it more readable
      const processedData = data.reduce((acc, item) => {
        if (item.Value && item.Value !== "Not Applicable") {
          acc[item.Variable] = item.Value;
        }
        return acc;
      }, {});

      setVehicleDetails(processedData);
    } catch (err) {
      displayError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Search Vehicle Information
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Search by Make and Model
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={showAllMakes}
                    onChange={handleShowAllMakesChange}
                    name="showAllMakes"
                    color="primary"
                  />
                }
                label="Show all makes (including uncommon)"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="make-select-label">Make</InputLabel>
                <Select
                  labelId="make-select-label"
                  id="make-select"
                  value={selectedMake}
                  label="Make"
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

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  label="Model"
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Search by VIN
              </Typography>
              <TextField
                fullWidth
                label="Vehicle Identification Number (VIN)"
                variant="outlined"
                value={vin}
                onChange={handleVinChange}
                sx={{ mb: 2 }}
                helperText="Enter a 17-character VIN"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={searchByVin}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SearchIcon />
                }
              >
                Search VIN
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {vehicleDetails && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Vehicle Details
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(vehicleDetails).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {key}
                      </Typography>
                      <Typography variant="h6">{value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

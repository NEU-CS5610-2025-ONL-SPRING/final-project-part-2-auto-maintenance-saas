import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import { API_ENDPOINTS } from "../config";
import { useAuth } from "../context/AuthContext";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SERVICES.LIST);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleSchedule = (service) => {
    if (!user) {
      navigate("/login", {
        state: { from: "/book-appointment", serviceId: service.id },
      });
    } else {
      navigate("/book-appointment", { state: { serviceId: service.id } });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Maintenance Services
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BuildIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h5" component="h2">
                        {service.name}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ${service.price}
                    </Typography>
                    <Typography color="text.secondary">
                      Duration: {service.duration} minutes
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleLearnMore(service)}
                    >
                      Learn More
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleSchedule(service)}
                    >
                      Schedule
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Service Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedService?.name}</DialogTitle>
          <DialogContent>
            <Typography variant="h6" color="primary" gutterBottom>
              ${selectedService?.price}
            </Typography>
            <Typography color="text.secondary" paragraph>
              Duration: {selectedService?.duration} minutes
            </Typography>
            <Typography paragraph>
              {selectedService?.description || "No description available."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              onClick={() => {
                handleCloseDialog();
                handleSchedule(selectedService);
              }}
              color="primary"
            >
              Schedule Service
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

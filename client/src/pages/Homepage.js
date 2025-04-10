import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function Homepage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DirectionsCarIcon
            sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
          />
          <Typography component="h1" variant="h3" gutterBottom>
            Welcome to Car Maintenance SaaS
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Your one-stop solution for car maintenance scheduling and services.
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
              >
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
              >
                Register
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/services"
                variant="contained"
                color="secondary"
                size="large"
              >
                View Services
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

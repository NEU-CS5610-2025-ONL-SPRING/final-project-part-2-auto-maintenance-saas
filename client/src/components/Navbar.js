import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleUserMenuClose();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and title */}
          <DirectionsCarIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              textDecoration: "none",
              color: "white",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Auto Maintenance
          </Typography>

          {isMobile ? (
            // Mobile menu
            <>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/services"
                  onClick={handleClose}
                >
                  Services
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/vehicles"
                  onClick={handleClose}
                >
                  Vehicle Search
                </MenuItem>
                {user && (
                  <MenuItem
                    component={RouterLink}
                    to="/appointments"
                    onClick={handleClose}
                  >
                    My Appointments
                  </MenuItem>
                )}
                {user && user.role === "admin" && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin"
                    onClick={handleClose}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}
                <Divider />
                {user ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <>
                    <MenuItem
                      component={RouterLink}
                      to="/login"
                      onClick={handleClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/register"
                      onClick={handleClose}
                    >
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            // Desktop menu
            <>
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <Button
                  component={RouterLink}
                  to="/services"
                  sx={{ color: "white", mx: 1 }}
                >
                  Services
                </Button>
                <Button
                  component={RouterLink}
                  to="/vehicles"
                  sx={{ color: "white", mx: 1 }}
                >
                  Vehicle Search
                </Button>
                {user && (
                  <Button
                    component={RouterLink}
                    to="/appointments"
                    sx={{ color: "white", mx: 1 }}
                  >
                    My Appointments
                  </Button>
                )}
                {user && user.role === "admin" && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    sx={{ color: "white", mx: 1 }}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>

              {user ? (
                <Box>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleUserMenu}
                    color="inherit"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={userMenuAnchor}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem disabled>{user.email}</MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    sx={{
                      ml: 1,
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        opacity: 0.9,
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

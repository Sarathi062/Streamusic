import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Container,
  Stack,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    background: { default: "#f0f4fc" },
    primary: { main: "#565add" },
    amber: { main: amber[800], contrastText: "#fff" },
    secondary: { main: "#E0C2FF", white: "#fff", contrastText: "#47008F" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: { borderRadius: 30, fontWeight: "bold" },
        outlined: { borderRadius: 30 },
      },
    },
  },
});

export default function AdminLoginModal({ toggleModal }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(""); // "success", "error", "notfound", "exception"
  const [waiting, setWaiting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("");
    setWaiting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BackEnd}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            mail: values.email,
            password: values.password,
          }),
        }
      );
      setWaiting(false);

      if (response.status === 400) setStatus("notfound");
      else if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          window.location.href = "/Streamusic";
        }, 1000);
      } else setStatus("error");
    } catch (err) {
      setWaiting(false);
      setStatus("exception");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          maxWidth: 600,
        }}
      >
        <Container maxWidth="sm" sx={{ py: 0 }}>
          <Paper
            elevation={8}
            sx={{
              position: "relative",
              px: { xs: 2, sm: 6 },
              pt: { xs: 4, sm: 8 },
              pb: { xs: 6, sm: 8 },
              borderRadius: 5,
              bgcolor: "#f0f4fc",
              boxShadow: "0 6px 30px 6px rgba(80,100,140,0.11)",
              m: 4,
            }}
          >
            {/* Cross icon at top right */}
            <IconButton
              aria-label="close"
              onClick={() => toggleModal(null)} 
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: (theme) => theme.palette.grey[700],
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h5"
              mb={2}
              color="primary"
              fontWeight={700}
              align="center"
              sx={{ letterSpacing: 0.5 }}
            >
              Admin Login
            </Typography>

            {status === "success" && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Login successful!
              </Alert>
            )}
            {status === "notfound" && (
              <Alert severity="error" sx={{ mb: 2 }}>
                User not found.
              </Alert>
            )}
            {status === "error" && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Invalid credentials.
              </Alert>
            )}
            {status === "exception" && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                An error occurred. Please try again.
              </Alert>
            )}
            {waiting && (
              <Stack sx={{ width: "100%" }} alignItems="center" mb={2}>
                <CircularProgress size={30} color="primary" />
              </Stack>
            )}

            <form onSubmit={handleLogin} noValidate>
              <TextField
                label="Email"
                fullWidth
                name="email"
                variant="standard"
                margin="normal"
                required
                value={values.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                autoComplete="email"
              />

              <TextField
                label="Password"
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                variant="standard"
                margin="normal"
                required
                value={values.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="current-password"
              />

              {/* <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={values.remember}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ my: 1 }}
              /> */}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: "bold" }}
                disabled={waiting}
              >
                Login
              </Button>
            </form>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Button
                variant="text"
                onClick={() => toggleModal("adminRegistration")}
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Sign up
              </Button>
              <Button
                variant="text"
                href="/"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Forgot password?
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

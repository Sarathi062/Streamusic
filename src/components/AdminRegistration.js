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
  CircularProgress,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { amber, red } from "@mui/material/colors";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 120,
  height: 120,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
}));

const theme = createTheme({
  palette: {
    background: {
      default: "#f0f4fc", // subtle light blue background
    },
    primary: { main: "#565add" },
    amber: { main: amber[800], contrastText: "#fff" },
    secondary: { main: "#E0C2FF", white: "#fff", contrastText: "#47008F" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: { borderRadius: 30, boxShadow: "lg", fontWeight: "bold" },
        outlined: { borderRadius: 30 },
      },
    },
  },
});

// Validation schemas for form fields and OTP
const registrationSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "Enter your full name")
    .required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password required"),
});

const otpSchema = yup.object({
  otp: yup
    .string()
    .matches(/^\d{4,6}$/, "Enter valid OTP")
    .required("OTP is required"),
});

const AdminRegisterWithOtp = ({ toggleModal }) => {
  const [step, setStep] = useState(1); // 1=Details, 2=OTP, 3=Password + Register
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Formik for registration form: fullName, email, password
  const formikReg = useFormik({
    initialValues: { fullName: "", email: "", password: "" },
    validationSchema: registrationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setWaiting(true);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BackEnd}/admin/registration`,
          {
            name: values.fullName,
            mail: values.email,
            password: values.password,
          }
        );
        setWaiting(false);
        if (res.status === 201 || res.status === 200) {
          setSuccess("Registration successful!");
          setStep(1);
          formikReg.resetForm();
          setShowOtpField(false);
        }
      } catch (err) {
        setWaiting(false);
        if (err.response && err.response.data) {
          setError(err.response.data.error || "Registration error.");
        } else {
          setError("Server or network error.");
        }
      }
    },
  });

  // Formik for OTP
  const formikOtp = useFormik({
    initialValues: { otp: "" },
    validationSchema: otpSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setWaiting(true);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BackEnd}/admin/registration/verify-otp`,
          {
            otp: values.otp,
            email: formikReg.values.email,
          }
        );
        setWaiting(false);
        if (res.status === 200) {
          setShowOtpField(false);
          setSuccess("OTP verified, please set your password.");
          setStep(3);
        }
      } catch (err) {
        setWaiting(false);
        setError("Incorrect OTP. Try again.");
      }
    },
  });

  // Handler to send OTP to entered email
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    setWaiting(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BackEnd}/admin/registration/send-otp`,
        { mail: formikReg.values.email }
      );
      setWaiting(false);
      if (res.status === 200) {
        setShowOtpField(true);
        setSuccess("OTP sent. Check your email.");
      }
    } catch (err) {
      setWaiting(false);
      setError("Failed to send OTP.");
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
        <Container
          maxWidth="sm"
          sx={{
            py: 0,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              px: { xs: 2, sm: 6 },
              pt: { xs: 4, sm: 8 },
              pb: { xs: 6, sm: 8 },
              borderRadius: 5,
              bgcolor: "#f0f4fc",
              boxShadow: "0 6px 30px 6px rgba(80,100,140,0.11)",
              m: 4
            }}
          >
            <Typography
              variant="h5"
              mb={2}
              color="primary"
              fontWeight={700}
              align="center"
              sx={{ letterSpacing: 0.5 }}
            >
              Admin Registration
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {waiting && (
              <Stack sx={{ width: "100%" }} alignItems="center" mb={2}>
                <CircularProgress size={30} color="primary" />
              </Stack>
            )}

            {/* Step 1: Full Name and Email */}
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                noValidate
              >
                <TextField
                  label="Full Name"
                  fullWidth
                  name="fullName"
                  variant="standard"
                  margin="normal"
                  onChange={formikReg.handleChange}
                  onBlur={formikReg.handleBlur}
                  value={formikReg.values.fullName}
                  error={
                    formikReg.touched.fullName &&
                    Boolean(formikReg.errors.fullName)
                  }
                  helperText={
                    formikReg.touched.fullName && formikReg.errors.fullName
                  }
                  autoComplete="name"
                />
                <TextField
                  label="Email"
                  fullWidth
                  name="email"
                  variant="standard"
                  margin="normal"
                  onChange={formikReg.handleChange}
                  onBlur={formikReg.handleBlur}
                  value={formikReg.values.email}
                  error={
                    formikReg.touched.email && Boolean(formikReg.errors.email)
                  }
                  helperText={formikReg.touched.email && formikReg.errors.email}
                  autoComplete="email"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, mb: 2, fontWeight: "bold" }}
                  disabled={
                    waiting ||
                    !formikReg.values.fullName ||
                    !formikReg.values.email ||
                    formikReg.errors.fullName ||
                    formikReg.errors.email
                  }
                  onClick={handleSendOtp}
                  type="button"
                >
                  Verify Email
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {showOtpField && (
              <form onSubmit={formikOtp.handleSubmit} noValidate>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Enter OTP sent to <b>{formikReg.values.email}</b>
                </Alert>
                <Stack direction="row" spacing={2} mb={2}>
                  <TextField
                    label="OTP"
                    variant="outlined"
                    name="otp"
                    value={formikOtp.values.otp}
                    onChange={formikOtp.handleChange}
                    onBlur={formikOtp.handleBlur}
                    error={
                      formikOtp.touched.otp && Boolean(formikOtp.errors.otp)
                    }
                    helperText={formikOtp.touched.otp && formikOtp.errors.otp}
                    sx={{ width: "60%" }}
                    inputProps={{ maxLength: 6 }}
                    autoComplete="one-time-code"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      waiting || !formikOtp.values.otp || !!formikOtp.errors.otp
                    }
                    sx={{ fontWeight: "bold", height: 56 }}
                  >
                    Verify OTP
                  </Button>
                </Stack>
              </form>
            )}

            {/* Step 3: Password and Register */}
            {step === 3 && (
              <form onSubmit={formikReg.handleSubmit} noValidate>
                <TextField
                  label="Password"
                  fullWidth
                  name="password"
                  type="password"
                  variant="standard"
                  margin="normal"
                  onChange={formikReg.handleChange}
                  onBlur={formikReg.handleBlur}
                  value={formikReg.values.password}
                  error={
                    formikReg.touched.password &&
                    Boolean(formikReg.errors.password)
                  }
                  helperText={
                    formikReg.touched.password && formikReg.errors.password
                  }
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={
                    waiting ||
                    !formikReg.values.password ||
                    !!formikReg.errors.password
                  }
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  Register
                </Button>
              </form>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={toggleModal}
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Close
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminRegisterWithOtp;

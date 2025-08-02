import React from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    background: {
      default: "#f0f4fc",
    },
    primary: { main: "#565add" },
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

const SignInPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 400,
  margin: theme.spacing(4), // added margin here
  padding: theme.spacing(4),
  borderRadius: 8,
  backgroundColor: theme.palette.background.default,
  position: "relative",
  boxShadow: "0 6px 30px 6px rgba(80,100,140,0.11)",
}));
const providers = [
  { id: "spotify", name: "Spotify" },
  { id: "jiosaavn", name: "JioSaavn" },
  { id: "gaana", name: "Gaana" },
  { id: "youtube", name: "YouTube Music" },
];

export default function OAuthSignInModal({ toggleModal }) {
  const [loadingProvider, setLoadingProvider] = React.useState(null);
  const [error, setError] = React.useState("");

  const handleSignIn = async (provider) => {
    setError("");
    setLoadingProvider(provider.id);
    // Simulate async sign-in process with fake delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulating error example:
      setError(`Sign in with ${provider.name} is currently unavailable.`);
    } catch (e) {
      setError("Unexpected error during sign in.");
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SignInPaper>
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={() => toggleModal(null)}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          align="center"
          mb={3}
          color="primary"
          fontWeight={700}
        >
          Sign in with your music provider
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="contained"
              color="primary"
              fullWidth
              disabled={loadingProvider !== null}
              onClick={() => handleSignIn(provider)}
              sx={{ textTransform: "none" }}
            >
              {loadingProvider === provider.id ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Sign in with ${provider.name}`
              )}
            </Button>
          ))}
        </Stack>
      </SignInPaper>
    </ThemeProvider>
  );
}

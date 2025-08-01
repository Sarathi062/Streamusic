// import React from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

// MUI Core
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { amber } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";

import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

// MUI Theme
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

// Custom Component
import HomeCard from "./HomeCard";
import HomeCarousel from "./HomeCarousel";

import GIF from "../assets/Moving The Simpsons GIF.gif";
// If you're using Typography from @mui/joy (optional)
import Typography from "@mui/material/Typography";

const Home = ({ toggleModal }) => {
  const Navigate = useNavigate();

  const theme = createTheme({
    palette: {
      amber: {
        main: amber[800], // or another shade like amber[700]
        contrastText: "#fff", // optional
      },
      secondary: {
        main: "#E0C2FF",
        light: "#82b1ff",
        white: "white",
        // dark: will be calculated from palette.secondary.main,
        contrastText: "#47008F",
      },
    },
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ width: "100%", mt: "55px" }}>
          <Stack spacing={2} width="100%">
            <Box
              component="section"
              sx={{
                minHeight: "65vh",
                width: "100%",
                display: "flex",
                alignItems: "top",
                justifyContent: "center",
                textAlign: "center",
                pb: 10,
              }}
              backgroundColor="#d1d1f7"
            >
              <Stack
                spacing={2}
                sx={{
                  top: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <Typography
                  level="h6"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "3rem", md: "4rem" },
                    fontWeight: "bold",
                  }}
                  color="#2b1c50"
                >
                  Your ultimate space for music discovery and streaming
                </Typography>

                <Typography
                  level="h4"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.5rem", md: "1.8rem" },
                  }}
                  color="#3d2e7c"
                >
                  Let the Crowd Choose the Beat
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="solid"
                    color="primary"
                    size="small"
                    sx={{
                      mt: 1,
                      borderRadius: "30px",
                      px: 4,
                      fontWeight: "bold",
                      backgroundColor: "#4b42ae",
                      color: "#fff",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: "lg",
                      maxWidth: "200px",
                    }}
                    onClick={toggleModal}
                  >
                    Host Music Session
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    size="small"
                    sx={{
                      mt: 1,
                      borderRadius: "30px",
                      px: 4,
                      fontWeight: "bold",
                      backgroundColor: "#fff",
                      color: "#565add",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: "lg",
                      maxWidth: "200px",
                    }}
                    onClick={() => {
                      Navigate("/Streamusic/user-login");
                    }}
                  >
                    Connect & Join Room
                  </Button>
                </Box>
                <Box
                  component="section"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  backgroundColor="#d1d1f7"
                >
                  <HomeCarousel />
                </Box>
              </Stack>
            </Box>

            <Divider orientation="horizontal" flexItem />

            <Box
              component="section"
              sx={{
                p: 4,
                height: "850px",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  background: "#2b1c50",
                  width: "100%",
                  borderRadius: "8%",
                  height: "100%",
                  color: "white",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 10,
                }}
              >
                <Grid container spacing={6}>
                  <Grid size={4}>
                    <img
                      src={GIF} // If it's inside public folder
                      alt="My GIF"
                      style={{
                        width: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  </Grid>
                  <Grid size={8}>
                    <Typography
                      level="h2"
                      sx={{
                        color: "#c7c6f9",
                        fontSize: { xs: 30, sm: 40, md: 25 },
                        textAlign: "left",
                      }}
                    >
                      Try for free
                    </Typography>
                    <Typography
                      level="h2"
                      sx={{
                        fontSize: { xs: 30, sm: 40, md: 45 },
                        textAlign: "left",
                      }}
                    >
                      Streamusic
                    </Typography>
                    <Typography
                      level="h6"
                      sx={{
                        color: "#c7c6f9",
                        fontSize: { xs: 10, sm: 10, md: 35 },
                        textAlign: "left",
                        width: "100%",
                        mt: 2,
                        mb: 5,
                      }}
                    >
                      Revolutionize group music experiences with smart,
                      collaborative playlists!
                    </Typography>
                    <Button
                      variant="solid"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: "30px",
                        px: 4,
                        fontWeight: "bold",
                        backgroundColor: "#565add",
                        color: "#fff",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                        boxShadow: "lg",
                        maxWidth: "200px",
                        width: "138px",
                        height: "60px",
                        border: "5px solid #4B42AD",
                      }}
                    >
                      Try now
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Divider orientation="horizontal" flexItem />

            <Box
              component="section"
              sx={{
                p: 2,
                height: { xs: "auto", md: "550px" },
                display: "flex",
                alignItems: "top",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Stack spacing={7}>
                <Typography
                  level="h6"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "3rem", md: "3rem" },
                    fontWeight: "bold",
                    mt: 4,
                    mb: 4,
                    textAlign: "left",
                  }}
                >
                  Powerful Features for Easy, Custom Music Experiences
                </Typography>
                <Box
                  component="section"
                  sx={{
                    height: { xs: "auto", md: "550px" },

                    display: "flex",
                    alignItems: "top",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "200px",
                  }}
                >
                  <Grid size={6}>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Spotify OAuth Integration
                    </Alert>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Collaborative Song Queue
                    </Alert>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Song Voting System
                    </Alert>

                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Smart Search via YouTube API
                    </Alert>
                  </Grid>
                  <Grid size={6}>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Cloud-Ready Architecture
                    </Alert>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Live Queue Updates
                    </Alert>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Admin Playback Control
                    </Alert>
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      severity="info"
                      sx={{
                        fontSize: 16,
                        alignItems: "center",
                        mb: 2,
                        background: "#e7ecf1",
                      }}
                    >
                      Responsive Web App
                    </Alert>
                  </Grid>
                  {/* <Grid container spacing={2}>
                    
                  </Grid> */}
                </Box>
              </Stack>
            </Box>

            <Divider orientation="horizontal" flexItem />

            <Box
              component="section"
              sx={{
                p: 2,
                pb: 10,
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                spacing={7}
                sx={{
                  p: 2,
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  level="h6"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "3rem", md: "3rem" },
                    fontWeight: "bold",
                    mt: 4,
                    mb: 4,
                    textAlign: "left",
                  }}
                >
                  Frequently Asked Questions
                </Typography>
                <Box
                  component="section"
                  sx={{
                    height: { xs: "auto", md: "auto" },
                    display: "flex",
                    alignItems: "top",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "200px",
                  }}
                >
                  <HomeCard />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;

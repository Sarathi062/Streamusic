import { useQuery } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Box from "@mui/material/Box";
import { Modal, Box } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";

import { Route, Routes } from "react-router-dom";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import AdminRegistration from "./components/AdminRegistration";
import AdminLogin from "./components/AdminLogin";
import UserLogin from "./components/UserLogin";
import Home from "./components/Home";
import axios from "axios";

function App() {
  // State to show/hide modal
  const [modalOpen, setModalOpen] = useState(false);

  // Function to toggle modal
  const toggleModal = () => setModalOpen(!modalOpen);
  // Fetching the loging cookies
  const fetchAdminCookies = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BackEnd}/admin/cookies`,
      {
        withCredentials: true, // important to send httpOnly cookies
      }
    );
    return res.data; // { loggedIn: true, adminLogin: true }
  };
  const useAdminAuth = () => {
    return useQuery({
      queryKey: ["adminAuth"],
      queryFn: fetchAdminCookies,
      retry: false, // optional: don't retry if unauthorized
      staleTime: 1000 * 60 * 10, // cache for 10 minutes
    });
  };
  const { data, isLoading, isError } = useAdminAuth();
  const adminLogin = data?.adminLogin ?? false;
  // -------------------------------------------------------------

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#E0C2FF",
        light: "#e7ecf1",
        white: "white",
        // dark: will be calculated from palette.secondary.main,
        // contrastText: "#47008F",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }} backgroundColor="secondary.light">
        <Nav adminLogin={adminLogin} />
        <Routes>
          <Route
            path="/Streamusic"
            element={<Home toggleModal={toggleModal} />}
          />
          {/* <Route
            path="Streamusic/admin-registration"
            element={}
          /> */}
          <Route path="Streamusic/admin-login" element={<AdminLogin />} />
          <Route path="Streamusic/user-login" element={<UserLogin />} />

          <Route
            path="Streamusic/dashboard"
            element={<AdminDashboard adminLogin={adminLogin} />}
          />
        </Routes>

        <Footer toggleModal={toggleModal} />
        <Modal
          open={modalOpen}
          onClose={toggleModal}
          aria-labelledby="popup-modal-title"
          aria-describedby="popup-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#f0f4fc",
              borderRadius: 2,
              boxShadow: 24,
              borderRadius: 5,
              p: 0,
              maxWidth: 600,
              width: "90%",
              display: "flex",
              flexDirection: "column", // Optional: if AdminRegistration needs vertical stacking
              alignItems: "center", // Optional: center content horizontally
              justifyContent: "center", // Optional: center content vertically
            }}
          >
            <AdminRegistration toggleModal={toggleModal} />
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default App;

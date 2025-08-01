import { Box, Typography, Divider, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";

const Footer = ({toggleModal}) => {
  const navigate = useNavigate();
  const gohome = () => {
  navigate("/Streamusic");
  window.scrollTo(0, 0); // ✅ Scroll to top
};

const login = () => {
  navigate("/Streamusic/admin-login");
  window.scrollTo(0, 0);
};



  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#c7c6f9",
        color: "#3d2e7c",
        py: 4,
        px: { xs: 2, sm: 4, md: 10 },
      }}
    >
      <Grid container spacing={3}>
        {/* About Section */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="h6" gutterBottom>
            Streamusic
          </Typography>
          <Typography variant="body2">
            Let the crowd choose the beat! Collaborative music experience for
            your parties, cafés, or gym.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Grid>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
          </Grid>
          <Grid>
            <Link
              onClick={gohome}
              color="inherit"
              underline="hover"
              display="block"
              style={{ cursor: "pointer" }}
            >
              Home
            </Link>
          </Grid>
          <Grid>
            <Link
              onClick={login}
              color="#3d2e7c"
              underline="hover"
              display="block"
              style={{ cursor: "pointer" }}
            >
              Admin Login
            </Link>
          </Grid>
          <Grid>
            <Link
               onClick={toggleModal}
              color="inherit"
              underline="hover"
              display="block"
              style={{ cursor: "pointer" }}
            >
              Register Admin
            </Link>
          </Grid>
        </Grid>

        {/* Contact Info */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Typography variant="body2">
            Email: sarathi062023@gmail.com
          </Typography>
          <Typography variant="body2">Phone: +91 7262924896</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ bgcolor: "#444", my: 8 }} />

      <Typography variant="body2" align="center" color="gray">
        © {new Date().getFullYear()} Streamusic. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

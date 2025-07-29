import { useState, useEffect } from "react";
import { debounce } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { setWindow } from "../store/changewindowSlice.js";

import Grid from "@mui/material/Grid2";
import { styled, alpha } from "@mui/material/styles";
import { Box, InputBase, Stack, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";

import AdminQueue from "./AdminQueue.js";
import SelectedSongs from "./SelectedSongs.js";
import QueuedSongs from "./QueuedSongs";
import TrendingSongs from "./TrendingSongs.js";
import SearchedSongs from "./SearchedSongs.js";
import MemberQueue from "./MemberQueue";
import axios from "axios";



const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function AdminDashboard({ adminLogin }) {
  const dispatch = useDispatch();
  const [roomCode, setRoomCode] = useState(null);
  

  const [query, setQuery] = useState(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = debounce(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    dispatch(setWindow({ changewindow: true }));
  }, 200); // 200ms debounce delay

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const createRoom = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BackEnd}/admin/createRoom`,
        {}, // no body needed
        {
          withCredentials: true, // 🔒 Ensures cookies like adminID are sent
        }
      );

      if (response.data.success) {
        const { roomCode, roomId } = response.data;
        // console.log("Room created or found:", roomCode);

        fetchRoomCode();
        // Example: You might want to display the roomCode to the admin
        // alert(`Room code: ${roomCode}`);
        return { roomCode, roomId };
      } else {
        console.warn("Room creation failed:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create or fetch the room.");
      return null;
    }
  };
  const fetchRoomCode = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BackEnd}/admin/getRoomCode`,
        {
          withCredentials: true, // Include cookies
        }
      );

      if (res.data.success) {
        // console.log("Room Code:", res.data.roomCode);
        setRoomCode(res.data.roomCode);
      }
    } catch (error) {
      console.error("Failed to fetch room code:", error);
      return null;
    }
  };


  useEffect(() => {
    fetchRoomCode();
  }, []);
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        bgcolor: "background.default",
        pt: "100px",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          bgcolor: "background.default",
        }}
      >
        <Box
          component="main"
          sx={{
            width: "100%",
            boxSizing: "border-box",
            bgcolor: "background.default",
            mb: "30px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1565c0", // darker blue for text
                  fontWeight: "bold",
                  width: "fit-content",
                }}
              >
                {roomCode ? `Room Code: ${roomCode}` : "Create Room --->"}
              </Typography>
            </Grid>
            <Grid size={6}>
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
                  width: "200px",
                  height: "35px",
                }}
                onClick={createRoom}
              >
                Create new room
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Search sx={{ mb: 3, ml: 3, mr: 3, width: "100%" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            sx={{ border: 1 }}
          />
        </Search>
        <AdminQueue roomCode={roomCode} />
        <SelectedSongs />
        {query ? (
          <SearchedSongs query={query} />
        ) : (
          <TrendingSongs adminLogin={adminLogin} />
        )}
      </Box>
    </Box>
  );
}
export default AdminDashboard;

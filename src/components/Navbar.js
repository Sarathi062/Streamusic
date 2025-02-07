import React, { useEffect, useState, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import { AppBar, Box, Toolbar, Typography, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LoginDialog from "./LoginDialog";
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { setQuery } from '../store/searchQuerySlice.js';
import { setLoading } from "../store/loadingSlice.js";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { setOpen } from "../store/dialogSlice.js";
import { Password } from "@mui/icons-material";

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


function Navbar({ setSearchResults, setShowQueue }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.searchQuery.value);
  const { accessToken, expiresAt } = useSelector((state) => state.auth); // using the access token to search the songs
  const { userauth, UaccessToken } = useSelector((state) => state.userauth); // the ans is true or false
  const open = useSelector((state) => state.dialog.open);
  const [data, setdata] = useState(null);
  const [session, setSession] = React.useState(null);


  const logedIn = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('logedIn='))
    ?.split('=')[1] === 'true';
  const adminLogin = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('adminLogin='))
    ?.split('=')[1] === 'true';

  const authentication = useMemo(() => ({
    signIn: () => {
      dispatch(setOpen(true));
      if (data || adminLogin) {
        setSession({
          user: data || { name: "Admin", email: "thepack@gmail.com" }
        });
      }
    },
    signOut: () => {
      setSession({ user: null });
      document.cookie = "logedIn=; path=/; Secure; max-age=0; SameSite=None";
      document.cookie = "adminLogin=; path=/; Secure; max-age=0; SameSite=None";
      dispatch(setAuth({ userauth: false }));
      dispatch(setOpen(true));
    },
  }), [data, adminLogin, dispatch]);

  const showQueue = () => {
    setShowQueue(prevState => !prevState);
  }


  const handleClose = () => {
    if (logedIn) {
      dispatch(setOpen(false));

    }
    navigate('/Streamusic');


  }
  useEffect(() => {
    if (logedIn && !adminLogin) {
      // Regular user login
      setSession({ user: { name: "Member", email: "" } });
      dispatch(setOpen(false));
    } else if (adminLogin) {
      // Admin login
      setSession({ user: { name: "Admin", email: "thepack@gmail.com" } });
      dispatch(setOpen(false));
    } else {
      // Neither logged in nor admin
      setSession(null);
      dispatch(setOpen(true));
    }
  }, [logedIn, adminLogin, dispatch]);


  // Debounced search function
  useEffect(() => {
    if (!accessToken || !searchQuery) {
      return
    };

    const timer = setTimeout(async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await response.json();
        if (data.tracks) {
          setSearchResults(data.tracks.items);
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error("Error searching songs:", error);
      }
    }, 500); // ⏳ Waits 500ms before making API request

    return () => clearTimeout(timer); // Cleanup function
  }, [searchQuery, accessToken, setSearchResults]);

  return (

    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 100,
            fontSize: { xs: 13, sm: 14, md: 18 },
            whiteSpace: "nowrap",
            overflow: "visible",
            textOverflow: "clip",
            minWidth: "120px",
          }}
        >
          PACK PLAYER
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Button variant="text" color="white" onClick={showQueue} sx={{ padding: 1 }}>
            <QueueMusicIcon sx={{ margin: "auto" }} />
          </Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Typography variant="h6" sx={{ fontWeight: 100, fontSize: 15, padding: 1 }}>
            <AuthenticationContext.Provider value={authentication} >
              <SessionContext.Provider value={session}>
                {/* preview-start */}
                <Account />
                {/* preview-end */}
              </SessionContext.Provider>
            </AuthenticationContext.Provider>
          </Typography>
          {!logedIn && <LoginDialog open={open} handleClose={handleClose} />}
        </Box>
      </Toolbar>
    </AppBar>

  );
}

export default Navbar;

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import QueuedSongs from './components/QueuedSongs';
import ListOFSearchedSong from './components/SearchedSong';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import { setAuth, setToken } from "./store/authSlice";
import { setWindow } from "./store/changewindowSlice";
import LikedSongs from './components/LikedSongs';
import AdminQueue from './components/AdminQueue';
import MemberQueue from './components/MemberQueue';
import { setQueue } from './store/queuedSongSlice';
import Alert from '@mui/material/Alert';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function App() {
  const logedIn = getCookie('logedIn');
  const adminLogin = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('adminLogin='))
    ?.split('=')[1] === 'true';
  const queueCount = parseInt(getCookie('queueCount'), 10);
  const dispatch = useDispatch();
  const open = useSelector((state) => state.dialog.open);
  const [currentSong, setCurrentSong] = useState(null);
  const queuedSong = useSelector((state) => state.queuedSong.queuedSong);

  // const [queuedSong, setQueue] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const changewindow = useSelector((state) => state.changewindow.changewindow);

  const [showqueue, setShowQueue] = useState(false);

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

  //function for our app to use search feature or app access token
  const fetchAccessToken = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const url = "https://accounts.spotify.com/api/token";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
      });

      const data = await response.json();
      if (data.access_token) {
        const expiresAt = Date.now() + data.expires_in * 1000;
        const accessToken = data.access_token;


        document.cookie = `spotify_access_token=${accessToken}; path=/; max-age=${data.expires_in}; Secure; SameSite=None`;
        document.cookie = `spotifyAppExpiresAt=${expiresAt}; path=/; max-age=${data.expires_in}; Secure; SameSite=None`;
        // Save to Redux
        dispatch(setToken({ accessToken: accessToken, expiresAt }));
      } else {
        console.error("Failed to get access token:", data);
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const getToken = async () => {
    const storedToken = getCookie("spotify_access_token");
    const expiresAt = parseInt(getCookie('spotifyAppExpiresAt'), 10);
    if (storedToken) {
      if (Date.now() < expiresAt) {
        // If token is still valid, update Redux & return
        dispatch(setToken({ accessToken: storedToken, expiresAt }));

        return;
      }
    }

    // If token is missing or expired, fetch a new one
    await fetchAccessToken();
  };



  useEffect(() => {
    const logedIn = getCookie('logedIn');
    const spotifyAccessToken = getCookie('spotifyAccessToken');
    if (logedIn) {
      dispatch(setAuth({ userauth: true, UaccessToken: spotifyAccessToken }));
    }
    getToken();

  }, []);


  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, queuedSong]);




  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds

  useEffect(() => {
    // Function to calculate the remaining time
    const calculateTimeLeft = () => {
      const endTime = parseInt(getCookie('endTime'));
      if (endTime) {
        const currentTime = new Date().getTime();
        const timeLeft = Math.floor((new Date(endTime).getTime() - currentTime) / 1000);
        setTimeLeft(timeLeft > 0 ? timeLeft : 0);
      }
    };

    // Check if there's already an end time in cookies on component mount
    calculateTimeLeft();

    // Start a timer to update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startCountdown = (seconds) => {
    const endTime = new Date().getTime() + seconds * 1000;
    document.cookie = `endTime=${new Date(endTime).toString()}; path=/; max-age=${seconds}; Secure; SameSite=None`; // Save the end time in cookies
    setTimeLeft(seconds);
  };

  const showAlert = useSelector((state) => state.showAlert.showAlert);
  console.log(showAlert);


  return (
    <>
      <Box component="section" >
        {!adminLogin && (
          <>
            <Grid size={12}>
              <Navbar setSearchResults={setSearchResults} setShowQueue={setShowQueue} />
              {queueCount == 7 && <Alert severity="warning">You can add more songs after 1 hour.</Alert>}
              {showAlert && <Alert severity="success">Song added to queue</Alert>}
            </Grid>
            {windowSize.width < 650 ? (
              <Stack spacing={2}>
                <Grid size={12}>
                  {showqueue && <MemberQueue />}
                </Grid>
                <Grid size={12}>
                  {logedIn && (<ListOFSearchedSong searchResults={searchResults} />)}
                </Grid>
                <Grid size={12}>
                  <QueuedSongs onSongSelect={setCurrentSong} queuedSong={queuedSong} />
                </Grid>
              </Stack>
            ) : (
              <Grid container spacing={1}>
                <Grid size={12}>
                  {showqueue && <MemberQueue />}
                </Grid>
                <Grid size={queuedSong.length === 0 ? 12 : 6}>
                  {logedIn && (<ListOFSearchedSong searchResults={searchResults} />)}
                </Grid>
                <Grid size={6}>
                  <QueuedSongs onSongSelect={setCurrentSong} queuedSong={queuedSong} />
                </Grid>
              </Grid>
            )}
          </>)}

        {adminLogin && (
          <>
            <Grid size={12}>
              <Navbar setSearchResults={setSearchResults} setShowQueue={setShowQueue} />
            </Grid>
            {windowSize.width < 650 ? (
              <Stack spacing={2}>
                <Grid size={12}>
                  {showqueue && <AdminQueue />}
                </Grid>
                <Grid size={12}>
                  <ListOFSearchedSong searchResults={searchResults} adminLogin={adminLogin} />
                </Grid>
                <Grid size={12}>
                  <QueuedSongs onSongSelect={setCurrentSong} queuedSong={queuedSong} />
                </Grid>
              </Stack>
            ) : (
              <Grid container spacing={1}>
                <Grid size={12}>
                  {showqueue && <AdminQueue />}
                </Grid>
                <Grid size={queuedSong.length === 0 ? 12 : 6}>
                  <ListOFSearchedSong searchResults={searchResults} adminLogin={adminLogin} />
                </Grid>
                <Grid size={6}>
                  <QueuedSongs onSongSelect={setCurrentSong} queuedSong={queuedSong} adminLogin={adminLogin} />
                </Grid>
              </Grid>
            )}



          </>)}

      </Box>
    </>
  );
}

export default App;

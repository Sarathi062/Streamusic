import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Box, Card, Typography, Button, Slider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PlayArrow, Pause } from "@mui/icons-material";
import { debounce } from 'lodash';
import { useDispatch } from "react-redux";
import { setWindow } from "../store/changewindowSlice";
function MusicPlayer({ song, onPrev, onNext }) {

  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const playerRef = useRef(null);

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
  const apiKeys = [
    'AIzaSyB8xe-pC_uYbBOdQ9_JldZxJHyZyxGZ2gU',
    'AIzaSyDDd6PlacJnbdjmAThQ-P1h2q1mopxphcc',
    'AIzaSyAMMZLJ7ATjIYAdz-atxV-vPv1e1xumFRc',
    'AIzaSyCm7wv1C0aPDlGK3OPUfYVGIEcCXG3Sk54',
    'AIzaSyDlgGSs2w32aedBgJ5PLbvIurfTBH7T0P8',
    'AIzaSyDH_Q0cvzezf5JMROkPzMMOA_PkE5qpMFY',
    'AIzaSyDb1i8QG2CVrsmyP-6aUaLo1_M4W4f8yzU',
    'AIzaSyCI6-RU1-yZF_oIDbWmV9zrMhKdznPgtxY',
    'AIzaSyDRfXr8A16LH1Upyod1p3uwm-JSiBRk84Y'
  ];

  const fetchVideoId = async (apiKeys) => {
    const query = song?.name || song?.title;
    if (!query) return;

    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKeys[i]}&type=video&maxResults=1&videoCategoryId=10`
        );
        if (response.ok) {
          const data = await response.json();
          const fetchedVideoId = data.items?.[0]?.id?.videoId;
          if (fetchedVideoId) {
            setVideoId(fetchedVideoId);
            return; // Exit the function if successful
          }
        }
      } catch (error) {
        console.error(`Error fetching video ID with key ${apiKeys[i]}:`, error);
      }
    }

    console.error("All API keys have been exhausted or are invalid.");
  };


  useEffect(() => {
    fetchVideoId(apiKeys);
  }, [song]);

  useEffect(() => {
    if ("mediaSession" in navigator && song) {
      const { name, artists, album } = song;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: name,
        artist: artists?.map((artist) => artist.name).join(", "),
        album: album?.name || "Unknown Album",
        artwork: [
          { src: album?.images?.[0]?.url || "", sizes: "96x96", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("previoustrack", onPrev);
      navigator.mediaSession.setActionHandler("nexttrack", onNext);
      navigator.mediaSession.setActionHandler("play", handlePlayPause);
      navigator.mediaSession.setActionHandler("pause", handlePlayPause);
    }
  }, [song, onPrev, onNext]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoStateChange = (event) => {
    if (event.data === 0) onNext?.();
    if (event.data === 1) setIsPlaying(true); // Playing
    if (event.data === 2) setIsPlaying(false); // Paused
  };

  const handleOnReady = (event) => {
    playerRef.current = event.target;
    setDuration(playerRef.current.getDuration());
    const interval = setInterval(() => {
      if (!isSeeking) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleSliderChange = (event, value) => {
    setIsSeeking(true);
    setCurrentTime(value);
  };

  const handleSliderCommit = () => {
    playerRef.current?.seekTo(currentTime);
    setIsSeeking(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={{ width: "0", height: "0", playerVars: { autoplay: 1 } }}
          onStateChange={handleVideoStateChange}
          onReady={handleOnReady}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: 11,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          p: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left: Song Details */}
          {windowSize.width > 650 && (<Grid item xs={3} sx={{ display: "flex", alignItems: "center", p: 1 }}>
            {song ? (

              <Box>
                <Typography variant="h6">{song.name || song.title || "Unknown Title"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {song.artists?.map((artist) => artist.name).join(", ") || ""}
                </Typography>
              </Box>

            ) : (
              <Typography variant="body1">No song selected</Typography>
            )}
          </Grid>)}

          {/* Center: Slider (Now Properly Sized) */}
          <Grid item xs={5} sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "center", p: 1 }}>
            <Typography variant="body2">{formatTime(currentTime)}</Typography>
            <Slider
              value={currentTime}
              min={0}
              max={duration}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderCommit}
              sx={{ flexGrow: 1, mx: 2 }} // Ensures full width
            />
            <Typography variant="body2">{formatTime(duration)}</Typography>
          </Grid>

          {/* Right: Controls (Now Properly Aligned) */}
          <Grid item xs={3} sx={windowSize.width > 650 ? { display: "flex", justifyContent: "flex-end", p: 1 } : { display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "center", p: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={onPrev} size={windowSize.width < 650 ? "small" : "medium"}>
                Previous
              </Button>
              <Button variant="contained" onClick={handlePlayPause} size={windowSize.width < 650 ? "small" : "medium"}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </Button>
              <Button variant="contained" onClick={onNext} size={windowSize.width < 650 ? "small" : "medium"}>
                Next
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>


  );
}

export default MusicPlayer;

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  CircularProgress,
  Skeleton,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";
import MusicPlayer from "./MusicPlayer"; // Import MusicPlayer
import axios from "axios";

const socket = io(process.env.REACT_APP_BackEnd, { withCredentials: true }); // initiates a connection from the client to your backend server using the URL provided and triggers the io.connection function

export default function AdminQueue({ adminLogin, roomCode }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null); // Store selected song
  const [currentRoom, setCurrentRoom] = useState(null);
  
  const fetchQueue = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BackEnd}/admin/getsongs`,
        {
          withCredentials: true, // Include cookies
        }
      );

      if (res.data.success) {
        setQueue(res.data.songs);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQueue();
    socket.emit("join-room");
    socket.on("update-queue", (songs) => {
      setQueue(songs);
    });
    return () => {
      socket.off("update-queue");
    };
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    socket.emit("switchRoom", currentRoom, roomCode);

    setCurrentRoom(roomCode);
  }, [roomCode]);

  const handleSongSelect = (song) => {
    setCurrentSong(song); // Set the selected song
  };

  const handleNext = () => {
    const currentIndex = queue.findIndex((s) => s.name === currentSong?.name);
    if (currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = queue.findIndex((s) => s.name === currentSong?.name);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
    }
  };
  const removeFromQueue = async (song) => {
    const updatedQueue = queue.filter((s) => s.id !== song.id);
    setQueue(updatedQueue); // Update the local queue state

    if (currentSong?.id === song.id) {
      setCurrentSong(null); // Clear the player if the removed song was playing
    }

    // Call the backend to remove the song from the server-side queue
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BackEnd}/queue/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ songId: song.id }), // Send the song ID
        }
      );

      const data = await response.json();
      if (data.message !== "Song removed from queue") {
        console.error("Failed to remove song from backend.");
      }
    } catch (error) {
      console.error("Error removing song from backend:", error);
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{ width: "100%", bgcolor: "background.paper", p: 2 }}
    >
      {loading ? (
        <Stack alignItems="center">
          <CircularProgress style={{ color: "black" }} />
        </Stack>
      ) : (
        <>
          <Button>Playing Songs</Button>
          {queue.length > 0 ? (
            <Box
              sx={{
                maxHeight: adminLogin ? "700px" : "200px",
                overflowY: "auto",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
              }}
            >
              <List sx={{ width: "100%" }}>
                {queue.map((song, index) => {
                  const title = song.name || song.title || "Unknown Title";
                  const artist = Array.isArray(song.artists)
                    ? song.artists.map((artist) => artist.name).join(", ")
                    : song.channelTitle || song.artist || "Unknown Artist";
                  const image =
                    song.album?.images?.[0]?.url || song.thumbnail || "";

                  return (
                    <React.Fragment key={index}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          p: 0,
                          cursor: "pointer",
                          bgcolor:
                            song === currentSong ? "#e0e0e0" : "transparent",
                        }}
                      >
                        <ListItemAvatar>
                          {image ? (
                            <Avatar alt={title} src={image} />
                          ) : (
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                          )}
                        </ListItemAvatar>
                        <ListItemText
                          primary={title}
                          onClick={() => handleSongSelect(song)}
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {artist}
                            </Typography>
                          }
                        />
                        {/* <Button onClick={() => removeFromQueue(song)}>
                          <ClearIcon sx={{ width: "40px", height: "40px" }} />
                        </Button> */}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          ) : (
            <>
              <Alert severity="info">Add Songs First</Alert>
            </>
          )}
        </>
      )}

      {/* Music Player Component */}
      {currentSong && (
        <MusicPlayer
          song={currentSong}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </Stack>
  );
}

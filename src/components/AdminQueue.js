import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    Stack, Typography, List, ListItem, ListItemAvatar, ListItemText,
    Avatar, Divider, Box, CircularProgress, Skeleton
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import MusicPlayer from "./MusicPlayer"; // Import MusicPlayer

const socket = io("https://streamusic-backend.onrender.com");

export default function AdminQueue() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null); // Store selected song

    const adminLogin = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('adminLogin='))
        ?.split('=')[1] === 'true';

    const fetchQueue = async () => {
        try {
            const response = await fetch("https://streamusic-backend.onrender.com/queue");
            const data = await response.json();
            setQueue(data.queue);
        } catch (error) {
            console.error("Error fetching queue:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        socket.on("queueUpdated", (updatedQueue) => {
            setQueue(updatedQueue);
        });

        return () => {
            socket.off("queueUpdated");
        };
    }, []);

    const handleSongSelect = (song) => {
        setCurrentSong(song); // Set the selected song
    };

    const handleNext = () => {
        const currentIndex = queue.findIndex(s => s.name === currentSong?.name);
        if (currentIndex < queue.length - 1) {
            setCurrentSong(queue[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        const currentIndex = queue.findIndex(s => s.name === currentSong?.name);
        if (currentIndex > 0) {
            setCurrentSong(queue[currentIndex - 1]);
        }
    };
    const removeFromQueue = async () => {
        const currentIndex = queue.findIndex(s => s.name === currentSong?.name);
        if (currentIndex > -1) {
          // Remove the song from the local queue
          const updatedQueue = queue.filter((_, index) => index !== currentIndex);
          setQueue(updatedQueue); // Update the local queue state
          setCurrentSong(null); // Clear the current song
      
          // Call the backend to remove the song from the server-side queue
          try {
            const response = await fetch('https://streamusic-backend.onrender.com/queue/remove', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ songId: queue[currentIndex].id }), // Send the songId
            });
      
            const data = await response.json();
            if (data.message === "Song removed from queue") {
            } else {
              // Handle failure response
              console.error("Failed to remove song from backend.");
            }
          } catch (error) {
            console.error("Error removing song from backend:", error);
          }
        }
      };
      

    return (
        <Stack spacing={2} sx={{ width: "100%", bgcolor: "background.paper", p: 2 }}>
            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress style={{ color: "black" }} />
                </Stack>
            ) : (
                <Box sx={{
                    maxHeight: adminLogin ? "700px" : "200px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" }
                }}>
                    <List sx={{ width: "100%" }}>
                        <Typography variant="h6" color="text.primary">
                            Playing Songs
                        </Typography>
                        {queue.map((song, index) => {
                            const title = song.name || song.title || "Unknown Title";
                            const artist = song.artists?.[0]?.name || song.channelTitle || "Unknown Artist";
                            const image = song.album?.images?.[0]?.url || song.thumbnail || "";

                            return (
                                <React.Fragment key={index}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{ p: 1, cursor: "pointer", bgcolor: song === currentSong ? "#e0e0e0" : "transparent" }}
                                        onClick={() => handleSongSelect(song)}
                                    >
                                        <ListItemAvatar>
                                            {image ? <Avatar alt={title} src={image} /> : <Skeleton variant="circular" width={40} height={40} />}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={title}
                                            secondary={<Typography variant="body2" color="text.secondary">{artist}</Typography>}
                                        />
                                        <ClearIcon
                                            onClick={(event) => removeFromQueue(event, song)} sx={{ width: "40px", height: "40px" }} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            );
                        })}
                    </List>
                </Box>
            )}

            {/* Music Player Component */}
            {currentSong && <MusicPlayer song={currentSong} onPrev={handlePrev} onNext={handleNext} />}
        </Stack>
    );
}

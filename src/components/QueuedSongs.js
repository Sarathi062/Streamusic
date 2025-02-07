import React, { useEffect } from "react";
import SongItem from "./SongItem";
import { styled } from '@mui/material/styles';
import { Button, Typography, Card, CardContent, CardMedia, List, ListItem, Stack, Grid2, Box, Skeleton, Avatar, Divider, ListItemText, ListItemAvatar } from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useSelector, useDispatch } from "react-redux";
import { get } from 'lodash';
import { setUserQueueCount } from "../store/usercountSlice.js";
import { setQueue } from '../store/queuedSongSlice';

function QueuedSongs({ onSongSelect, queuedSong, adminLogin }) {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.userqueuecount.userqueuecount);
    const queueCount = parseInt(document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('queueCount='))
        ?.split('=')[1] || 0);

    if (queuedSong.length === 0) { return null; }

    const sendToQueue = async (queuedSongs) => {
        await fetch("https://streamusic-backend.onrender.com/queue/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ songs: queuedSongs }), // ✅ Correct JSON format
        });
    };
    const handleaddtoQueue = () => {
        if (queuedSong.length <= 7) {
            document.cookie = `queueCount=${count + queueCount}; max-age=${6 * 60 * 60}; path=/; secure; SameSite=None`;
            dispatch(setUserQueueCount(0));
            sendToQueue(queuedSong);
            dispatch(setQueue([]));
            // setQueue([]); Clear the queue

        }
    };
    const handleaddtoQueueAdmin = () => {
        if (queuedSong.length >= 1) {
            document.cookie = `queueCount=0;path=/; secure; SameSite=None`;
            sendToQueue(queuedSong);
            dispatch(setQueue([]));
            // setQueue([]);  Clear the queue
        }
    };

    const handleQueueClick = () => {
        if (adminLogin) {
            handleaddtoQueueAdmin();
        } else {
            handleaddtoQueue();
        }
    };
    const converTominutes = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return (
        <Stack spacing={3} sx={{ width: "100%", bgcolor: "background.paper", p: 2 }}>


            <Button>Selected Songs</Button>
            <Box sx={{
                maxHeight: "400px",  // Adjust height as needed
                overflowY: "auto",
                scrollbarWidth: "thin", // Firefox
                "&::-webkit-scrollbar": { width: "8px" }, // WebKit browsers
                "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" }
            }}>

                <List sx={{ width: "100%" }}>
                    {queuedSong.map((song, index) => {
                        const track = song.track || {};
                        const title = song.name || song.title || "Unknown Title";
                        const artist = song.artists?.[0]?.name || song.artist || song.channelTitle || "Unknown Artist";
                        const duration = song.duration_ms || song.duration || 0;
                        const image = song.album?.images?.[0]?.url || song.thumbnail || "";

                        return (
                            <React.Fragment key={index}>
                                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                    <ListItemAvatar>

                                        {image ? (
                                            <Avatar alt={title} src={image} />
                                        ) : (
                                            <Skeleton variant="circular" width={40} height={40} />
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={title}
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {artist}
                                            </Typography>
                                        }
                                    />

                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        );
                    })}
                </List>

            </Box>

            <Button
                variant="contained"
                startIcon={<QueueMusicIcon />}
                onClick={handleQueueClick}
                sx={{ alignSelf: "center", mt: 2 }}
            >
                Add to Queue
            </Button>
        </Stack>
    );
}

export default QueuedSongs;

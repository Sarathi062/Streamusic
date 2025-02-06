import React, { useEffect, useState, useCallback } from 'react';
import { Grid } from '@mui/material/Grid2';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/loadingSlice.js";
import { setUserQueueCount } from "../store/usercountSlice.js";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
    List, ListItem, ListItemAvatar, ListItemText, Avatar, Checkbox,
    Divider, Typography, Stack, CircularProgress, Skeleton
} from "@mui/material";
import { get, set } from 'lodash';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function SearchedSong({ searchResults, setQueue, adminLogin }) {
    const [likedSongs, setLikedSongs] = useState([]);
    const { userauth, UaccessToken } = useSelector((state) => state.userauth);
    const dispatch = useDispatch();
    const [trendingSongs, setTrendingSongs] = useState([]);
    const MAX_QUEUE_LIMIT = 5; // Set max limit
    const searchQuery = useSelector((state) => state.searchQuery.value);
    const loading = useSelector((state) => state.loading.loading);
    const count = useSelector((state) => state.userqueuecount.userqueuecount);
    const [showList, setShowList] = useState(false);
    const [showListTS, setShowListTS] = useState(false);
    const queueCount = parseInt(document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('queueCount='))
        ?.split('=')[1] || 0);


    const convertYouTubeDurationToMS = (duration) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;

        // Convert to milliseconds
        const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

        return totalMilliseconds;
    };
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

    const fetchTrendingSongs = async (apiKeys) => {
        if (!apiKeys || apiKeys.length === 0) return;

        for (let i = 0; i < apiKeys.length; i++) {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&videoCategoryId=10&key=${apiKeys[i]}&maxResults=10`;

            try {
                dispatch(setLoading(true));
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();

                    if (data.items) {
                        const trending = data.items.map((item) => ({
                            id: item.id,
                            title: item.snippet.title,
                            description: item.snippet.description,
                            thumbnail: item.snippet.thumbnails.default.url,
                            channelTitle: item.snippet.channelTitle,
                            duration: convertYouTubeDurationToMS(item.contentDetails.duration),
                        }));

                        setTrendingSongs(trending);
                        dispatch(setLoading(false));
                        return; // Exit function on success
                    }
                }
            } catch (error) {
                console.error(`Error fetching trending songs with key ${apiKeys[i]}:`, error);
            }
        }

        console.error("All API keys have been exhausted or are invalid.");
        dispatch(setLoading(false));
    };

    useEffect(() => {
        fetchTrendingSongs(apiKeys);
    }, []);


    const addToQueue = (song, isChecked) => {
        setQueue((prevQueue) => {
            if (isChecked) {
                if (adminLogin || count < MAX_QUEUE_LIMIT) { // Admin can bypass limit
                    dispatch(setUserQueueCount(count + 1));
                    return [...prevQueue, song]; // Add song
                } else {
                    return prevQueue; // Don't add if limit reached
                }
            } else {
                dispatch(setUserQueueCount(count - 1)); // Decrease count
                return prevQueue.filter((s) => s.id !== song.id); // Remove song
            }
        });
    };

    useEffect(() => {
        if (!UaccessToken) return;
        const fetchLikedSongs = async () => {
            const url = `https://api.spotify.com/v1/me/tracks?limit=50`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${UaccessToken}`,
                },
            });
            const data = await response.json();
            if (data.items) {
                const likedSongs = data.items.map((item) => ({                    
                    id: item.track.id,
                    title: item.track.name,
                    artist: item.track.artists.map((artist) => artist.name).join(', '),
                    album: item.track.album.name,
                    duration: item.track.duration_ms,
                    thumbnail: item.track.album.images?.[0]?.url || "",
                }));
                setLikedSongs(likedSongs);
            } else {
                console.error('Error fetching liked songs:', data);
            }
        };
        fetchLikedSongs();
    }, [UaccessToken]);

    const toggelList = () => {
        setShowList(!showList);
    }
    const toggelListTS = () => {
        setShowListTS(!showListTS);
    }
    return (
        <Stack spacing={1} sx={{ width: "100%", bgcolor: "background.paper", p: 2 }}>
            <Button endIcon={showListTS ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />} onClick={toggelListTS}>{searchQuery && searchResults.length > 0 ? "Searched Results" : "Trending Songs"}</Button>

            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress style={{ color: "black" }} />
                </Stack>
            ) : (<><Box sx={{
                maxHeight: "400px",  // Adjust height as needed
                overflowY: "auto",
                scrollbarWidth: "thin", // Firefox
                "&::-webkit-scrollbar": { width: "8px" }, // WebKit browsers
                "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" }
            }}>

                <List sx={{ width: "100%" }} hidden={showListTS && !searchQuery}>
                    {searchQuery && searchResults.length > 0 && (
                        <>
                            {searchResults.map((song) => (
                                <React.Fragment key={song.id}>
                                    <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                        <ListItemAvatar>
                                            {song.album?.images?.[0]?.url ? (
                                                <Avatar alt={song.name} src={song.album.images[0].url} />
                                            ) : (
                                                <Skeleton variant="circular" width={40} height={40} />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={song.name}
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {song.artists.map((artist) => artist.name).join(", ")}
                                                </Typography>
                                            }
                                        />
                                        <Checkbox
                                            onClick={(e) => addToQueue(song, e.target.checked)}
                                            color="primary"
                                            disableRipple
                                            disabled={!adminLogin ? queueCount + count >= MAX_QUEUE_LIMIT : false}

                                        />

                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </>
                    )}

                    {/* 🔥 Trending Songs Section */}
                    {!searchQuery && trendingSongs?.length > 0 && (
                        <>

                            {trendingSongs.map((song) => (
                                <React.Fragment key={song.id}>
                                    <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                        <ListItemAvatar>
                                            {song.thumbnail ? (
                                                <Avatar alt={song.title} src={song.thumbnail} />
                                            ) : (
                                                <Skeleton variant="circular" width={40} height={40} />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={song.title}
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {song.channelTitle}
                                                </Typography>
                                            }
                                        />
                                        <Checkbox
                                            onClick={(e) => addToQueue(song, e.target.checked)}
                                            color="primary"
                                            disableRipple
                                            disabled={!adminLogin ? queueCount + count >= MAX_QUEUE_LIMIT : false}

                                        />

                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </List>
            </Box>
            </>
            )}
            {!adminLogin && (<><Button endIcon={showList ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />} onClick={toggelList}>Liked Songs</Button>

                <Box sx={{
                    maxHeight: "400px",  // Adjust height as needed
                    overflowY: "auto",
                    scrollbarWidth: "thin", // Firefox
                    "&::-webkit-scrollbar": { width: "8px" }, // WebKit browsers
                    "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" }
                }}>
                    <List sx={{ width: "100%" }} hidden={showList}>
                        {/* 🔍 Liked Songs Section */}
                        {likedSongs.length > 0 && UaccessToken && (
                            <>

                                {likedSongs.map((song) => (
                                    <React.Fragment key={song.id}>
                                        <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                            <ListItemAvatar>
                                                {song.thumbnail ? (
                                                    <Avatar alt={song.title} src={song.thumbnail} />
                                                ) : (
                                                    <Skeleton variant="circular" width={40} height={40} />
                                                )}
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={song.title}
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {song.artist}
                                                    </Typography>
                                                }
                                            />
                                            <Checkbox
                                                onClick={(e) => addToQueue(song, e.target.checked)}
                                                color="primary"
                                                disableRipple
                                                disabled={!adminLogin ? queueCount + count >= MAX_QUEUE_LIMIT : false}

                                            />

                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </List>
                </Box> </>)}


        </Stack>
    );
}

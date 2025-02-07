import { createSlice } from "@reduxjs/toolkit";

const queuedSongSlice = createSlice({
    name: 'queuedSong',
    initialState: {
        queuedSong: []
    },
    reducers: {
        setQueue: (state, action) => {
            state.queuedSong = action.payload;
        }
    }
});

export const { setQueue } = queuedSongSlice.actions;
export const queuedSongReducer = queuedSongSlice.reducer;

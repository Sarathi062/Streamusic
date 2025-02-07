import { createSlice } from '@reduxjs/toolkit';

const showAlertSlice = createSlice({
    name: 'showAlert',
    initialState: {
        showAlert: false,
    },
    reducers: {
        setShowAlert: (state, action) => {
            state.showAlert = action.payload;
        },
    },
});

export const { setShowAlert } = showAlertSlice.actions;
export const showAlertSliceReducer = showAlertSlice.reducer;
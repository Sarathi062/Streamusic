import { configureStore } from "@reduxjs/toolkit";
import { authReducer, userauthReducer } from "./authSlice.js";
import { searchQueryReducer } from "./searchQuerySlice.js";
import { loadingReducer } from "./loadingSlice.js";
import { changewindowReducer } from "./changewindowSlice.js";
import { userqueuecountReducer } from "./usercountSlice.js";
import { dialogReducer } from "./dialogSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    userauth: userauthReducer,
    searchQuery: searchQueryReducer,
    loading: loadingReducer,
    changewindow: changewindowReducer,
    userqueuecount: userqueuecountReducer,
    dialog: dialogReducer,
  },
});

export default store;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // adjust if file is named differently
import messagesReducer from "./messageSlice"; // adjust if file is named differently
import callReducer from "./callSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    call: callReducer,
  },
});

export default store;

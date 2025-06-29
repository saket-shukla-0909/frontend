import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  callAccepted: false,
  callEnded: false,
  receivingCall: false,
  caller: null,
  callerSignal: null,
  remoteStream: null,
  localStream: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCallAccepted: (state, action) => {
      state.callAccepted = action.payload;
    },
    setCallEnded: (state, action) => {
      state.callEnded = action.payload;
    },
    setReceivingCall: (state, action) => {
      state.receivingCall = action.payload;
    },
    setCaller: (state, action) => {
      state.caller = action.payload;
    },
    setCallerSignal: (state, action) => {
      state.callerSignal = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    resetCallState: () => initialState,
  },
});

export const {
  setCallAccepted,
  setCallEnded,
  setReceivingCall,
  setCaller,
  setCallerSignal,
  setRemoteStream,
  setLocalStream,
  resetCallState,
} = callSlice.actions;

export default callSlice.reducer;

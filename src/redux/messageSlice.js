// src/redux/messageSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import socket from '../socket/socket';

// ✅ Thunk: Send a new message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        { message: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔄 Emit the new message to socket server
      socket.emit('new-message', response.data.newMessage);

      console.log(response.data, 'Message sent successfully');
      return response.data.newMessage;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Thunk: Fetch all messages for selected conversation
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (receiverId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        `/messages/getMessage/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data, 'Fetched messages successfully');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages, receiveMessage } = messagesSlice.actions;
export default messagesSlice.reducer;

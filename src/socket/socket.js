// src/socket/socket.js
import { io } from "socket.io-client";


const socket = io(process.env.REACT_APP_BASE_URL || "http://localhost:3000", {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;

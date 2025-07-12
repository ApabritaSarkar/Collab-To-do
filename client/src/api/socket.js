import { io } from 'socket.io-client';

const socket = io('https://collab-to-do.onrender.com', {
  withCredentials: true,
  transports: ['websocket'], // or remove to allow polling fallback
});

export default socket;

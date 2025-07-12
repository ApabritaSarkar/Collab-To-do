import { io } from 'socket.io-client';

const socket = io('https://collab-to-do.onrender.com'); // change if deployed

export default socket;

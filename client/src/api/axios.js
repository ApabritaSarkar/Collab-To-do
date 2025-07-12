import axios from 'axios';

const API = axios.create({
  baseURL: 'https://collab-to-do.onrender.com', // 🔁 change if deployed
});

export default API;

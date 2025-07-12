import axios from 'axios';

const API = axios.create({
  baseURL: 'https://collab-to-do.onrender.com/api',
  withCredentials: true,
});

export default API;

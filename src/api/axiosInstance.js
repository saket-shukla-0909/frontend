import axios from "axios";

// Check the env variable
console.log("🔍 Base URL from .env:", process.env.REACT_APP_API_URL);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export default axiosInstance;

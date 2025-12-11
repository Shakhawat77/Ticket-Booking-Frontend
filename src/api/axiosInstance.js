// src/api/axiosInstance.js
import axios from "axios";

const API_BASE = "http://localhost:3000"; // backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Add JWT to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

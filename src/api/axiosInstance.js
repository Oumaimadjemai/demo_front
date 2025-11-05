// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://gestionstock-production.up.railway.app/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Catch global network errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // no response = network error
      console.error("🌐 Network error detected");
      window.dispatchEvent(new Event("offline")); // simulate offline event
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

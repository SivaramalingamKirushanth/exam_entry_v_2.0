import axios from "axios";

// Use the same route for both dev and prod
const baseURL = "/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enables cookie handling
});

export default axiosInstance;

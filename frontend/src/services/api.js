import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Update with your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

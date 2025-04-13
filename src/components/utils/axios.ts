import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "https://localhost:44381/api"
    : "https://mhdbackend.onrender.com/api";

const instance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

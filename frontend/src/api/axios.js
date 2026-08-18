import axios from "axios";

const api = axios.create({
  baseURL: "/innovation",
  timeout: 15000,
});

export default api;
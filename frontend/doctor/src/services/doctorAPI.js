import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// test backend connection
export const testBackend = () => API.get("/test");

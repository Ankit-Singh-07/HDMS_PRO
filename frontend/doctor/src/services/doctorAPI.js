import axios from "axios";

const API = axios.create({
  baseURL: "https://hdms-backend-7j7w.onrender.com/api",
});

// test backend connection
export const testBackend = () => API.get("/test");

import axios from "axios";

export const axiosMainInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

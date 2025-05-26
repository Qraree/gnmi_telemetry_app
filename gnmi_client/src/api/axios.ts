import axios from "axios";
import { invalidTokenMessage } from "../utils/constants.ts";
import { updateGnmiToken } from "./common.ts";

export const axiosMainInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

axiosMainInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = JSON.parse(error.request.response);
    if (error.status === 401 && response.message === invalidTokenMessage) {
      await updateGnmiToken();
      return await axiosMainInstance.request(error.config);
    }

    return Promise.reject(error);
  },
);

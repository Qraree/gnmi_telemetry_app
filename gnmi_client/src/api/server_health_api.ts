import { axiosMainInstance } from "./axios.ts";
import { AxiosResponse } from "axios";
import { ServerMetrics } from "../types/server-health.ts";

export const getServerHealth = async (): Promise<
  AxiosResponse<ServerMetrics>
> => {
  return await axiosMainInstance.get(`/server-health`);
};

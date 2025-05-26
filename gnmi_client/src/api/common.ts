import { axiosMainInstance } from "./axios.ts";
import { AxiosResponse } from "axios";

interface UpdateGnmiResponse {
  token: string;
}

export const updateGnmiToken = async (): Promise<
  AxiosResponse<UpdateGnmiResponse>
> => {
  return await axiosMainInstance.get("/token/update");
};

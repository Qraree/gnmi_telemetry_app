import { axiosMainInstance } from "./axios.ts";

export const getAllUsers = async () => {
  return await axiosMainInstance.get("/user/all/");
};

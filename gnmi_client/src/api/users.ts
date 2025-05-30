import { axiosMainInstance } from "./axios.ts";

export const getAllUsers = async () => {
  return await axiosMainInstance.get("/user/all/");
};

export const deleteUser = async (id: string) => {
  return await axiosMainInstance.delete(`/user/${id}`);
};

export const addUser = async (name: string, group: string) => {
  return await axiosMainInstance.post("/user/", {
    name: name,
    group: group,
  });
};

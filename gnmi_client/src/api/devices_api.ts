import { Device } from "../types/device.ts";
import { YangBase } from "../types/yang.ts";
import { axiosMainInstance } from "./axios.ts";
import { AxiosResponse } from "axios";

export const setInterfaceState = async (
  id: number,
  interfaceName: string,
  state: boolean,
): Promise<Device> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices/interface/state`, {
    method: "POST",
    body: JSON.stringify({ state, name: interfaceName, device_id: id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const setInterfaceIP = async (
  deviceId: number,
  interfaceName: string,
  index: number,
  ip: string,
  prefixLength: number,
) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  return await fetch(`${baseUrl}/devices/interface/ip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_id: deviceId,
      ip: ip,
      prefix_length: prefixLength,
      interface_name: interfaceName,
      index: index,
    }),
  });
};

export const getDeviceYang = async <T>(
  id: number,
  path: string[],
): Promise<YangBase<T>> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/yang`, {
    method: "POST",
    body: JSON.stringify({ id, path }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const addStaticRoute = async (
  id: number,
  prefix: string,
  nextHop: string,
) => {
  return await axiosMainInstance.post("/devices/routes/static/add", {
    device_id: id,
    prefix: prefix,
    next_hop: nextHop,
  });
};

export const deleteStaticRoute = async (id: number, prefix: string) => {
  return await axiosMainInstance.post("/devices/routes/static/delete", {
    device_id: id,
    prefix: prefix,
  });
};

export const getDeviceLogs = async (
  id: number,
  lines: number,
): Promise<AxiosResponse<string>> => {
  return await axiosMainInstance.get(`/devices/${id}/logs`, {
    params: {
      lines: lines,
    },
  });
};

export const testRPCRequest = async (): Promise<void> => {
  const response = await axiosMainInstance.get("/test/ssh");
  return response.data;
};

export const createDeviceSshSession = async (id: number) => {
  return await axiosMainInstance.post(`/devices/${id}/session/create`);
};

export const getAllDevices = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices/`);
  return await response.json();
};

export const getOneDevice = async (id: number): Promise<Device> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices/${id}`);
  return await response.json();
};

export const getAllConnections = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/connections`);
  return await response.json();
};

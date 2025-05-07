import { Device } from "../types/device.ts";

export const getDeviceSpecs = async (id: number): Promise<Device> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices/${id}/specs`);
  return await response.json();
};

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

export const getDeviceYang = async <T>(
  id: number,
  path: string[],
): Promise<T> => {
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

export const testRPCRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test`);
  return await response.json();
};

export const testSSHRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test/connections`);
  return await response.json();
};

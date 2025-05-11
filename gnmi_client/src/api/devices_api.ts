import { Device } from "../types/device.ts";
import { YangBase } from "../types/yang.ts";

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
      ip,
      prefix_length: prefixLength,
      interface_name: interfaceName,
      index: index,

      path: `/interfaces/interface[name=${interfaceName}]/subinterfaces/subinterface[index=${index}]/ipv4/addresses/address`,
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
  const response = await fetch(`${baseUrl}/test/ssh`);
  return await response.json();
};

export const testSSHRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test/connections`);
  return await response.json();
};

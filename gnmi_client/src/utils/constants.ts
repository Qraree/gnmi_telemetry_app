import { DeviceStatus } from "../types/device.ts";

export const statusStyles: Record<DeviceStatus, string> = {
  Online: "bg-green-500",
  Offline: "bg-red-500",
};

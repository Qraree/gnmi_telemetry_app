import { DeviceStatus } from "../types/device.ts";

export const statusStyles: Record<DeviceStatus, string> = {
  Online: "bg-green-500",
  Offline: "bg-red-500",
};

export const backgroundMainColor = "#100f0f";

export const visConfig = {
  layout: {
    improvedLayout: true,
  },
  autoResize: true,
  edges: {
    color: "#efe9e9",
  },
  interaction: {
    selectable: true,
  },
};

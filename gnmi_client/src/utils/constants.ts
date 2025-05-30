import { DeviceStatus } from "../types/device.ts";

export const statusStyles: Record<DeviceStatus, string> = {
  Online: "bg-green-500",
  Offline: "bg-red-500",
};

export enum ThemeColor {
  light = "light",
  dark = "dark",
}

export const backgroundDarkMainColor = "#100f0f";
export const backgroundLightMainColor = "#fff";

export const secondaryDarkBackgroundColor = "#1a1a1a";
export const secondaryLightBackgroundColor = "#f3f2f2";

export const graphDarkBackgroundColor = "#333333";
export const graphLightBackgroundColor = secondaryLightBackgroundColor;

export const cardLightColor = backgroundLightMainColor;
export const cardDarkColor = secondaryDarkBackgroundColor;

export const darkTextColor = "black";
export const lightTextColor = "white";

export interface ThemeConfig {
  theme: ThemeColor;
  primaryColor: string;
  colorPrimaryText: string;
  colorFillSecondary: string;
  graphBackgroundColor: string;
}

export const darkThemeConfig: ThemeConfig = {
  theme: ThemeColor.dark,
  primaryColor: backgroundDarkMainColor,
  colorPrimaryText: lightTextColor,
  colorFillSecondary: secondaryDarkBackgroundColor,
  graphBackgroundColor: graphDarkBackgroundColor,
};

export const lightThemeConfig: ThemeConfig = {
  theme: ThemeColor.light,
  primaryColor: backgroundLightMainColor,
  colorPrimaryText: darkTextColor,
  colorFillSecondary: secondaryLightBackgroundColor,
  graphBackgroundColor: graphLightBackgroundColor,
};

export const visConfig = {
  layout: {
    improvedLayout: true,
  },
  autoResize: true,
  physics: false,
  edges: {
    color: "#bfbcbc",
    smooth: false,
  },
  interaction: {
    selectable: true,
  },
};

export const breadcrumbsMap: Record<string, BreadChild> = {
  devices: {
    title: "Список устройств",
    childTitle: "Устройство",
    link: "/devices",
  },
  graph: { title: "Топология", childTitle: null, link: "/graph" },
  health: { title: "Состояние сервера", link: "/health", childTitle: null },
  tunnel: { title: "Туннелирование", link: "/tunnel", childTitle: null },
  deploy: { title: "Развертывание", link: "/deploy", childTitle: null },
  topologies: { title: "Топологии", link: "/topologies", childTitle: null },
  users: { title: "Пользователи", link: "/users", childTitle: null },
};

interface BreadChild {
  title: string;
  childTitle: string | null;
  link: string;
}

export const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

export const cidrMaskRegex = /^([0-9]|[1-2][0-9]|3[0-2])$/;

export const invalidTokenMessage = "Invalid or expired token";

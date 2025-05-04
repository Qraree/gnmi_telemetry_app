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
  // edges: {
  //   color: "#efe9e9",
  // },
  edges: {
    color: "#bfbcbc",
  },
  interaction: {
    selectable: true,
  },
};

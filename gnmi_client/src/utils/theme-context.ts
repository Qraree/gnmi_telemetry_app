import { Context, createContext } from "react";
import { ThemeConfig } from "./constants.ts";

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const ThemeContext: Context<ThemeContextType> = createContext<
  ThemeContextType | undefined
>(undefined);

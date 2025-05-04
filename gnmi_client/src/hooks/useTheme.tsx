import { useContext } from "react";
import { ThemeContext } from "../utils/theme-context.ts";

export const useTheme = () => {
  return useContext(ThemeContext);
};

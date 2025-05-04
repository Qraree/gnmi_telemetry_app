import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainPage } from "./pages/MainPage/MainPage.tsx";
import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import { GraphPage } from "./pages/GraphPage.tsx";
import { DeviceCard } from "./components/DeviceCard.tsx";
import {
  darkTextColor,
  lightTextColor,
  lightThemeConfig,
  secondaryDarkBackgroundColor,
  secondaryLightBackgroundColor,
  ThemeColor,
  ThemeConfig,
} from "./utils/constants.ts";
import { DevicePage } from "./pages/DevicePage.tsx";
import { useState } from "react";
import { ThemeContext } from "./utils/theme-context.ts";

function App() {
  const queryClient = new QueryClient();
  const [theme, setTheme] = useState<ThemeConfig>(lightThemeConfig);
  const isLightTheme = theme.theme === ThemeColor.light;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: isLightTheme ? darkTextColor : lightTextColor,
                // itemSelectedColor: !isLightTheme ? darkTextColor : "#0d3fea",
              },
            },
            token: {
              colorFillSecondary: isLightTheme
                ? secondaryLightBackgroundColor
                : secondaryDarkBackgroundColor,
            },
          }}
        >
          <BrowserRouter>
            <ThemeContext.Provider value={{ theme, setTheme }}>
              <Routes>
                <Route path="/" element={<MainPage />}>
                  <Route path="/devices" element={<DevicePage />} />
                  <Route path="/devices/:device" element={<DeviceCard />} />
                  <Route path="/graph" element={<GraphPage />} />
                </Route>
              </Routes>
            </ThemeContext.Provider>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

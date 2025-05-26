import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainPage } from "./pages/MainPage/MainPage.tsx";
import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import { GraphPage } from "./pages/GraphPage.tsx";
import { DevicePage } from "./pages/DevicePage.tsx";
import {
  darkTextColor,
  lightTextColor,
  lightThemeConfig,
  secondaryDarkBackgroundColor,
  secondaryLightBackgroundColor,
  ThemeColor,
  ThemeConfig,
} from "./utils/constants.ts";
import { DeviceListPage } from "./pages/DeviceListPage.tsx";
import { useState } from "react";
import { ThemeContext } from "./utils/theme-context.ts";
import { ServerHealthPage } from "./pages/ServerHealthPage.tsx";
import { TunnelPage } from "./pages/TunnelPage.tsx";
import { DeployPage } from "./pages/DeployPage/DeployPage.tsx";

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
            <ThemeContext value={{ theme, setTheme }}>
              <Routes>
                <Route path="/" element={<MainPage />}>
                  <Route path="/devices" element={<DeviceListPage />} />
                  <Route path="/devices/:device" element={<DevicePage />} />
                  <Route path="/graph" element={<GraphPage />} />
                  <Route path="/health" element={<ServerHealthPage />} />
                  <Route path="/tunnel" element={<TunnelPage />} />
                  <Route path="/deploy" element={<DeployPage />} />
                </Route>
              </Routes>
            </ThemeContext>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

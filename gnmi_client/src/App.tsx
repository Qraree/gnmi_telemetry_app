import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainPage } from "./pages/MainPage.tsx";
import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import NetworkDevicesList from "./components/DeviceList.tsx";
import { GraphPage } from "./pages/GraphPage.tsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: "#fff",
                itemHoverColor: "#c8c2c2",
                itemSelectedColor: "#000000",
              },
            },
            token: { colorBgBase: "#1a1a1a", colorTextBase: "#ffffff" },
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />}>
                <Route index path="/devices" element={<NetworkDevicesList />} />
                <Route path="/graph" element={<GraphPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

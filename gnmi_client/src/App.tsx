import "./App.css";
import NetworkDevicesList from "./components/DeviceList.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NetworkDevicesList />
      </QueryClientProvider>
    </>
  );
}

export default App;

import { useQuery } from "@tanstack/react-query";
import { getOneDevice } from "../api/devices_api.ts";
import { LayoutPage } from "./PageLayout.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Tabs, TabsProps } from "antd";
import { YangTab } from "../components/Device/Tabs/YangTab.tsx";
import { InterfaceTab } from "../components/Device/Tabs/InterfaceTab.tsx";
import { SystemInfoTab } from "../components/Device/Tabs/SystemInfoTab.tsx";
import { DeviceTab } from "../components/Device/Tabs/DeviceTab.tsx";
import { RoutingTab } from "../components/Device/Tabs/RoutingTab.tsx";
import { LogsTab } from "../components/Device/Tabs/LogsTab.tsx";

export const DevicePage = () => {
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device"],
    queryFn: () => getOneDevice(Number(device)),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isPending || !data) {
    return <div>Loading...</div>;
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Информация",
      children: <DeviceTab />,
    },
    {
      key: "2",
      label: "Интерфейсы",
      children: <InterfaceTab />,
    },
    {
      key: "3",
      label: "YANG",
      children: <YangTab />,
    },
    {
      key: "4",
      label: "Маршрутизация",
      children: <RoutingTab />,
    },
    {
      key: "5",
      label: "Системная информация",
      children: <SystemInfoTab />,
    },
    {
      key: "6",
      label: "Логи",
      children: <LogsTab />,
    },
  ];

  return (
    <LayoutPage title={data.name}>
      <Tabs defaultActiveKey="1" items={items} />
    </LayoutPage>
  );
};

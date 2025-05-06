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
      label: "Системная информация",
      children: <SystemInfoTab />,
    },
  ];

  return (
    <LayoutPage title={data.name.slice(15)}>
      <Tabs defaultActiveKey="1" items={items} />
    </LayoutPage>
  );
};

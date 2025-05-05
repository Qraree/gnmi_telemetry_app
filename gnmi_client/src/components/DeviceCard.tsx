import { useQuery } from "@tanstack/react-query";
import { getDeviceYang, getOneDevice } from "../api/devices_api.ts";
import { LayoutPage } from "../pages/PageLayout.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Tabs, TabsProps } from "antd";
import { DeviceTab } from "./Device/DeviceTab.tsx";
import { YangTab } from "./Device/YangTab.tsx";

export const DeviceCard = () => {
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device"],
    queryFn: () => getOneDevice(Number(device)),
  });

  const { data: specs } = useQuery({
    queryKey: ["device_interfaces"],
    queryFn: () => getDeviceYang(Number(device), ["/interfaces"]),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log(specs);
  }, [specs]);

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
      label: "YANG",
      children: <YangTab />,
    },
  ];

  return (
    <LayoutPage title={data.name.slice(15)}>
      <Tabs defaultActiveKey="1" items={items} />
    </LayoutPage>
  );
};

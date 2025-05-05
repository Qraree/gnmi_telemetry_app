import { useQuery } from "@tanstack/react-query";
import { getDeviceYang, getOneDevice } from "../api/devices_api.ts";
import { LayoutPage } from "../pages/PageLayout.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Tabs, TabsProps } from "antd";
import { DeviceInfo } from "./Device/DeviceInfo.tsx";

export const DeviceCard = () => {
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device"],
    queryFn: () => getOneDevice(Number(device)),
  });

  const { data: specs } = useQuery({
    queryKey: ["device_specs"],
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
      children: <DeviceInfo />,
    },
    {
      key: "2",
      label: "YANG",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <LayoutPage title={data.name.slice(15)}>
      <Tabs defaultActiveKey="1" items={items} />
    </LayoutPage>
  );
};

import { Descriptions, DescriptionsProps, Tag, Typography } from "antd";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang, getOneDevice } from "../../../api/devices_api.ts";
import { OpenConfigInterface } from "../../../types/yang.ts";

export const DeviceTab = () => {
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device"],
    queryFn: () => getOneDevice(Number(device)),
  });

  const { data: systemData } = useQuery({
    queryKey: ["system"],
    queryFn: () =>
      getDeviceYang<OpenConfigInterface>(Number(device), ["/system"]),
  });

  console.log(systemData);

  if (isPending || !data) {
    return <div>Loading...</div>;
  }

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "IP-адрес во внутренней сети",
      children: data?.container_ipv4_address,
    },
    {
      key: "2",
      label: "MAC-адрес",
      children: "8a:39:2d:6e:e2:ef",
    },
    {
      key: "3",
      label: "Операционная система",
      children: data?.image,
    },
    {
      key: "4",
      label: "Состояние",
      children: (
        <Tag color={data?.state === "running" ? "green" : "red"}>
          {data?.state}
        </Tag>
      ),
    },
  ];

  return (
    <Descriptions
      layout="vertical"
      column={2}
      title={<Typography.Title level={3}>Система</Typography.Title>}
      items={items}
    />
  );
};

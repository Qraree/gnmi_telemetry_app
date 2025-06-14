import { Anchor, Flex, Spin, Typography } from "antd";
import { InterfaceCard } from "../Interface/InterfaceCard.tsx";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../../api/devices_api.ts";
import { OpenConfigInterface } from "../../../types/yang.ts";

export const InterfaceTab = () => {
  const { device, error } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device_interfaces"],
    queryFn: () =>
      getDeviceYang<OpenConfigInterface>(Number(device), ["/interfaces"]),
  });

  if (error) {
    console.log("hello");
  }

  if (isPending && !data) {
    return (
      <Flex justify="center" align="center" style={{ height: "80vh" }}>
        <Spin size={"large"} />
      </Flex>
    );
  }

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 30 }}>
        Интерфейсы
      </Typography.Title>
      <Flex>
        <Flex
          vertical
          style={{
            width: "80%",
            maxHeight: "70vh",
            overflow: "scroll",
          }}
        >
          {data?.notification &&
            device &&
            data?.notification[0]?.update[0]?.val[
              "openconfig-interfaces:interface"
            ].map((interfaceItem) => (
              <InterfaceCard
                interfaceItem={interfaceItem}
                device={device}
                key={interfaceItem.name}
              />
            ))}
        </Flex>
        <Anchor
          items={
            data?.notification &&
            data?.notification[0]?.update[0]?.val[
              "openconfig-interfaces:interface"
            ].map((interfaceItem, index) => ({
              key: index,
              href: `#${interfaceItem.name}`,
              title: interfaceItem.name,
            }))
          }
        />
      </Flex>
    </div>
  );
};

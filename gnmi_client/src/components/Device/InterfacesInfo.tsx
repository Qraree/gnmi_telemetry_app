import { Card, Flex, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../api/devices_api.ts";
import { useParams } from "react-router";
import { OpenConfigInterface, YangBase } from "../../types/yang.ts";
import { FaCircle } from "react-icons/fa6";

export const InterfaceInfo = () => {
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device_interfaces"],
    queryFn: () =>
      getDeviceYang<YangBase<OpenConfigInterface>>(Number(device), [
        "/interfaces",
      ]),
  });

  if (isPending && !data) {
    return <Spin />;
  }

  //todo перенести интерфейсы в отдельный таб
  return (
    <div style={{ width: "50%" }}>
      <Typography.Title level={3} style={{ marginBottom: 30 }}>
        Интерфейсы
      </Typography.Title>
      <Flex
        vertical
        style={{
          maxHeight: "70vh",
          overflow: "scroll",
        }}
      >
        <div>{}</div>
        {data?.notification[0].update[0].val[
          "openconfig-interfaces:interface"
        ].map((interfaceItem) => (
          <Card
            title={interfaceItem.name}
            extra={
              <FaCircle
                style={{
                  color:
                    interfaceItem.state["admin-status"] == "UP"
                      ? "#4dec34"
                      : "red",
                }}
              />
            }
            style={{ width: "100%", marginBottom: 10 }}
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        ))}
      </Flex>
    </div>
  );
};

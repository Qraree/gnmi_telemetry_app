import { Device } from "../types/device.ts";
import { Button, Card, Flex, Tag } from "antd";
import { RouterSVG } from "../assets/RouterSVG.tsx";

export const DeviceListCard = ({ device }: { device: Device }) => {
  return (
    <Card
      title={device.name.slice(15)}
      style={{ width: "100%", marginBottom: 16, background: "#1a1a1a" }}
      extra={[
        <Tag color={device.state == "running" ? "green" : "red"} key="status">
          {device.state}
        </Tag>,
        <Tag color="cyan" key="status">
          {device.status}
        </Tag>,
        <Button key="details" type="link" href={"/devices/" + device.id}>
          Details
        </Button>,
        <Button key="delete" type="link" danger>
          Turn off
        </Button>,
      ]}
    >
      <Flex dir="row">
        <div style={{ marginRight: 18 }}>
          <RouterSVG />
        </div>
        <div>
          <p>
            <strong>Type:</strong> Switch L3
          </p>
          <p>
            <strong>IPv4:</strong> {device.container_ipv4_address}
          </p>
          <p>
            <strong>IPv6:</strong> {device.container_ipv6_address}
          </p>
        </div>
      </Flex>
    </Card>
  );
};

import { Device } from "../types/device.ts";
import { Button, Card, Flex, Tag } from "antd";
import { RouterSVG } from "../assets/RouterSVG.tsx";
import { useTheme } from "../hooks/useTheme.tsx";
import {
  cardDarkColor,
  cardLightColor,
  ThemeColor,
} from "../utils/constants.ts";
import { useNavigate } from "react-router";

export const DeviceListCard = ({ device }: { device: Device }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      title={
        <div style={{ color: theme.colorPrimaryText }}>
          {device.name.slice(15)}
        </div>
      }
      style={{
        width: "100%",
        marginBottom: 16,
        borderColor: theme.colorFillSecondary,
        background:
          theme.theme == ThemeColor.light ? cardLightColor : cardDarkColor,
      }}
      extra={[
        <Tag color={device.state == "running" ? "green" : "red"} key="status">
          {device.state}
        </Tag>,
        <Tag color="cyan" key="status">
          {device.status}
        </Tag>,
        <Button
          key="details"
          type="link"
          onClick={() => navigate(`/devices/${device.id}`)}
        >
          Информация
        </Button>,
        <Button key="delete" type="link" danger>
          Выключить
        </Button>,
      ]}
    >
      <Flex style={{ color: theme.colorPrimaryText }}>
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

import { Device } from "../types/device.ts";
import { Button, Card, Tag } from "antd";

export const DeviceCard = ({ device }: { device: Device }) => (
  <Card
    title={device.name}
    style={{ width: "100%", marginBottom: 16, background: "#1a1a1a" }}
    extra={[
      <Tag color="green" key="status">
        Active
      </Tag>,
      <Button key="details" type="link">
        Details
      </Button>,
      <Button key="edit" type="link">
        Edit
      </Button>,
      <Button key="delete" type="link" danger>
        Delete
      </Button>,
    ]}
  >
    <p>
      <strong>Type:</strong> Router
    </p>
    <p>
      <strong>IP:</strong> 192.168.1.0
    </p>
  </Card>
);

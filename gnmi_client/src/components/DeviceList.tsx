import { DeviceCard } from "./DeviceCard.tsx";
import { Button, Col, Input, Row } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllDevices,
  testRPCRequest,
  testSSHRequest,
} from "../api/devices_api.ts";
import { Device } from "../types/device.ts";

export default function NetworkDevicesList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["devices"],
    queryFn: getAllDevices,
  });

  const testRequest = useMutation({
    mutationFn: testRPCRequest,
  });

  const testSshRequest = useMutation({
    mutationFn: testSSHRequest,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <div
        style={{
          backgroundColor: "#100f0f",
          padding: "32px",
          minHeight: "100vh",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: "100%" }}>
          <h1
            style={{ color: "white", fontSize: "36px", marginBottom: "24px" }}
          >
            Network Devices
          </h1>

          <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
            <Col span={12}>
              <Input
                placeholder="Search devices..."
                style={{ width: "100%", background: "#1a1a1a" }}
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button type="default" onClick={() => testRequest.mutate()}>
                + Add Device
              </Button>
              <Button type="default" onClick={() => testSshRequest.mutate()}>
                test ssh
              </Button>
            </Col>
          </Row>

          <div>
            {data.map((device: Device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

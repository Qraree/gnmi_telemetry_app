import { LayoutPage } from "./PageLayout.tsx";
import DeviceList from "../components/DeviceList.tsx";
import { Button, Col, Input, Row } from "antd";
import { useMutation } from "@tanstack/react-query";
import { testRPCRequest, testSSHRequest } from "../api/devices_api.ts";
import { useTheme } from "../hooks/useTheme.tsx";

export const DevicePage = () => {
  const testRequest = useMutation({
    mutationFn: testRPCRequest,
  });

  const testSshRequest = useMutation({
    mutationFn: testSSHRequest,
  });

  const { theme } = useTheme();

  return (
    <LayoutPage title="Network Devices">
      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col span={12}>
          <Input
            placeholder="Search devices..."
            style={{
              width: "100%",
              background: theme.colorFillSecondary,
              color: theme.colorPrimaryText,
            }}
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

      <DeviceList />
    </LayoutPage>
  );
};

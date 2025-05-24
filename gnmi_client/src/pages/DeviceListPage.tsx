import { LayoutPage } from "./PageLayout.tsx";
import { Button, Col, Input, Row } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllDevices,
  testRPCRequest,
  testSSHRequest,
} from "../api/devices_api.ts";
import { useTheme } from "../hooks/useTheme.tsx";
import { Device } from "../types/device.ts";
import { DeviceListCard } from "../components/DeviceListCard.tsx";

export const DeviceListPage = () => {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["devices"],
    queryFn: getAllDevices,
  });

  const testRequest = useMutation({
    mutationFn: testRPCRequest,
    // onSuccess: () => testSshRequest.mutate(),
  });

  const testSshRequest = useMutation({
    mutationFn: testSSHRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  const { theme } = useTheme();

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <LayoutPage title="Список устройств">
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
            Обновить топологию
          </Button>
        </Col>
      </Row>

      {data &&
        data?.map((device: Device) => (
          <DeviceListCard key={device.id} device={device} />
        ))}
    </LayoutPage>
  );
};

import { Flex, Modal, Skeleton, Tag, Typography } from "antd";
import { VisEdge } from "../../types/device.ts";
import { RouterSVG } from "../../assets/RouterSVG.tsx";
import { useTheme } from "../../hooks/useTheme.tsx";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../api/devices_api.ts";
import { OpenConfigInterfaceSubInterface } from "../../types/yang.ts";
import { useEffect } from "react";

interface GraphModalProps {
  open: boolean;
  onOk: () => void;
  selectedEdge: VisEdge | null;
  onCancel: () => void;
}

export const GraphModal = ({
  open,
  onOk,
  selectedEdge,
  onCancel,
}: GraphModalProps) => {
  const { theme } = useTheme();

  const {
    data: firstInterface,
    isLoading: isLoadingFirst,
    refetch: refetchFirst,
  } = useQuery({
    queryKey: ["first_device_interface", selectedEdge?.from],
    queryFn: () =>
      getDeviceYang<OpenConfigInterfaceSubInterface>(
        Number(selectedEdge?.from),
        [
          `/interfaces/interface[name=${selectedEdge?.fromPort}]/subinterfaces/subinterface[index=0]`,
        ],
      ),
    enabled: !!selectedEdge?.from,
  });

  const {
    data: secondInterface,
    isLoading: isLoadingSecond,
    refetch: refetchSecond,
  } = useQuery({
    queryKey: ["second_device_interface", selectedEdge?.to],
    queryFn: () =>
      getDeviceYang<OpenConfigInterfaceSubInterface>(Number(selectedEdge?.to), [
        `/interfaces/interface[name=${selectedEdge?.toPort}]/subinterfaces/subinterface[index=0]`,
      ]),
    enabled: !!selectedEdge?.to,
  });

  useEffect(() => {
    if (selectedEdge) {
      refetchFirst();
      refetchSecond();
    }
  }, [selectedEdge]);

  const renderInterfaceInfo = (
    iface: OpenConfigInterfaceSubInterface | undefined,
    loading: boolean,
    label: string,
    deviceName?: string,
  ) => (
    <Flex vertical align="center" style={{ height: 200 }}>
      <div>{deviceName}</div>
      <RouterSVG />
      <Typography.Text strong>{label}</Typography.Text>
      {loading ? (
        <Skeleton paragraph={{ rows: 3 }} active />
      ) : iface ? (
        <Flex vertical align="center" gap={6}>
          <Typography.Text>
            {iface?.["openconfig-if-ip:ipv4"]?.addresses?.address &&
              iface?.["openconfig-if-ip:ipv4"]?.addresses?.address?.[0]?.ip +
                "/" +
                iface?.["openconfig-if-ip:ipv4"]?.addresses?.address?.[0]
                  ?.config?.["prefix-length"]}
          </Typography.Text>
          <Tag
            style={{ margin: "0 auto" }}
            color={
              iface?.["openconfig-if-ip:ipv4"]?.state?.enabled ? "green" : "red"
            }
          >
            {iface?.["openconfig-if-ip:ipv4"]?.state?.enabled
              ? "Активен"
              : "Выключен"}
          </Tag>
        </Flex>
      ) : (
        <Typography.Text type="secondary">Нет данных</Typography.Text>
      )}
    </Flex>
  );

  return (
    <Modal
      width="50%"
      title="Информация о соединении"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <div style={{ padding: 20 }}>
        <Flex justify="space-around" align="center">
          {renderInterfaceInfo(
            firstInterface?.notification[0].update[0].val,
            isLoadingFirst,
            selectedEdge?.fromPort || "—",
            selectedEdge?.fromDeviceName,
          )}
          <div
            style={{
              background: theme.colorPrimaryText,
              width: "60%",
              height: 1,
              marginTop: 25,
            }}
          />
          {renderInterfaceInfo(
            secondInterface?.notification?.[0]?.update?.[0]?.val,
            isLoadingSecond,
            selectedEdge?.toPort || "—",
            selectedEdge?.toDeviceName,
          )}
        </Flex>
      </div>
    </Modal>
  );
};

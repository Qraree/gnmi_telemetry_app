import { FaCircle } from "react-icons/fa6";
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Tag,
} from "antd";
import { OpenConfigInterfaceItem } from "../../../types/yang";
import { NanoTimestamp } from "../NanoTimeStamp.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setInterfaceIP, setInterfaceState } from "../../../api/devices_api.ts";
import { useState } from "react";
import { cidrMaskRegex, ipv4Regex } from "../../../utils/constants.ts";

interface IProps {
  interfaceItem: OpenConfigInterfaceItem;
  device: number | string;
}

type NotificationType = "success" | "info" | "warning" | "error";

export const InterfaceCard = ({ interfaceItem, device }: IProps) => {
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { state, config, subinterfaces } = interfaceItem;
  const isInterfaceUp = state["admin-status"] === "UP";
  const statusColor = isInterfaceUp ? "#4dec34" : "red";
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);

  const openNotificationWithIcon = (
    type: NotificationType,
    message = "Успешно",
    description = "Состояние интерфейса успешно изменено!",
  ) => {
    api[type]({
      message,
      description,
    });
  };

  const changeInterfaceState = useMutation({
    mutationFn: ({
      interfaceName,
      newState,
    }: {
      interfaceName: string;
      newState: boolean;
    }) => setInterfaceState(Number(device), interfaceName, newState),
    onSettled: () =>
      queryClient.refetchQueries({ queryKey: ["device_interfaces"] }),
    onSuccess: () => openNotificationWithIcon("success"),
    onError: () =>
      openNotificationWithIcon(
        "error",
        "Ошибка",
        "Состояние интерфейса не изменено",
      ),
  });

  const changeInterfaceIp = useMutation({
    mutationFn: ({
      deviceId,
      interfaceName,
      index,
      ip,
      prefixLength,
    }: {
      deviceId: number;
      interfaceName: string;
      index: number;
      ip: string;
      prefixLength: number;
    }) => setInterfaceIP(deviceId, interfaceName, index, ip, prefixLength),
    onSettled: () => {
      setIsModelOpen(false);
      queryClient.refetchQueries({ queryKey: ["device_interfaces"] });
    },
    onSuccess: () => openNotificationWithIcon("success"),
    onError: () =>
      openNotificationWithIcon("error", "Ошибка", "IP интерфейса не изменен"),
  });

  const openModel = () => {
    setIsModelOpen(true);
  };

  const cancelModal = () => {
    setIsModelOpen(false);
  };

  const onFinish = (values: any) => {
    const { ip, prefixLength } = values;

    changeInterfaceIp.mutate({
      deviceId: Number(device),
      interfaceName: interfaceItem.name,
      ip,
      prefixLength,
      index: selectedIndex,
    });
  };

  const handleSelectSub = (index: number) => {
    setSelectedIndex(index);
    form.setFieldsValue({
      ip: subinterfaces.subinterface?.[selectedIndex]?.["openconfig-if-ip:ipv4"]
        ?.addresses?.address?.[0]?.ip,
      prefixLength:
        subinterfaces.subinterface?.[selectedIndex]?.["openconfig-if-ip:ipv4"]
          ?.addresses?.address?.[0]?.config["prefix-length"],
    });
  };

  return (
    <>
      {contextHolder}
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaCircle style={{ color: statusColor }} />
            {interfaceItem.name}
          </span>
        }
        extra={[
          <Button type="link" onClick={openModel} style={{ marginRight: 10 }}>
            Редактировать
          </Button>,
          <Button
            key="delete"
            loading={changeInterfaceState.isPending}
            danger={isInterfaceUp}
            onClick={() =>
              changeInterfaceState.mutate({
                interfaceName: interfaceItem.name,
                newState: !isInterfaceUp,
              })
            }
          >
            {isInterfaceUp ? "Выключить" : "Включить"}
          </Button>,
        ]}
        style={{ width: "100%", marginBottom: 10 }}
        id={interfaceItem.name}
      >
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Тип">{config.type}</Descriptions.Item>
          <Descriptions.Item label="MTU">{config.mtu}</Descriptions.Item>
          <Descriptions.Item label="Индекс">{state.ifindex}</Descriptions.Item>
          <Descriptions.Item label="Аппаратный порт">
            {state["openconfig-platform-port:hardware-port"]}
          </Descriptions.Item>
          <Descriptions.Item label="Трансивер">
            {state["openconfig-platform-transceiver:transceiver"]}
          </Descriptions.Item>
          <Descriptions.Item label="Последнее изменение">
            <NanoTimestamp ns={state["last-change"]} />
          </Descriptions.Item>
          <Descriptions.Item label="Оперативный статус">
            <Tag color={state["oper-status"] === "UP" ? "green" : "red"}>
              {state["oper-status"]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {subinterfaces?.subinterface?.length > 0 && (
          <>
            <h4 style={{ marginTop: 16 }}>Подинтерфейсы</h4>
            {subinterfaces.subinterface.map((sub) => (
              <Card
                key={sub.index}
                size="small"
                type="inner"
                title={`Subinterface ${sub.index}`}
                style={{ marginTop: 10 }}
              >
                {sub["openconfig-if-ip:ipv4"]?.addresses?.address?.map(
                  (addr) => (
                    <Descriptions
                      key={addr.ip}
                      size="small"
                      column={1}
                      bordered
                      style={{ marginBottom: 10 }}
                    >
                      <Descriptions.Item label="IP">
                        {addr.state?.ip}/{addr?.state?.["prefix-length"]}
                      </Descriptions.Item>
                      <Descriptions.Item label="Origin">
                        {addr.state?.origin}
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                )}

                {sub["openconfig-if-ip:ipv4"]?.neighbors?.neighbor?.length >
                  0 && (
                  <>
                    <h5>Соседи</h5>
                    {sub["openconfig-if-ip:ipv4"].neighbors.neighbor.map(
                      (nbr, i) => (
                        <Descriptions
                          key={i}
                          size="small"
                          column={1}
                          bordered
                          style={{ marginBottom: 10 }}
                        >
                          <Descriptions.Item label="IP">
                            {nbr.state.ip}
                          </Descriptions.Item>
                          <Descriptions.Item label="MAC">
                            {nbr.state["link-layer-address"]}
                          </Descriptions.Item>
                          <Descriptions.Item label="Origin">
                            {nbr.state?.origin}
                          </Descriptions.Item>
                        </Descriptions>
                      ),
                    )}
                  </>
                )}
              </Card>
            ))}
          </>
        )}
      </Card>
      <Modal
        title="Изменить ip адрес"
        open={isModelOpen}
        onCancel={cancelModal}
        destroyOnClose={true}
        footer={false}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            style={{ marginTop: 30 }}
            name="subinterface"
            label="Подинтерфейс"
            rules={[{ required: true, message: "Выберите подинтерфейс" }]}
            initialValue={selectedIndex}
          >
            <Select
              placeholder="Выберите индекс"
              onChange={(val) => handleSelectSub(Number(val))}
              options={subinterfaces.subinterface.map((s) => ({
                label: `Subinterface ${s.index}`,
                value: s.index,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="ip"
            label="Новый IP-адрес"
            initialValue={
              subinterfaces.subinterface?.[selectedIndex]?.[
                "openconfig-if-ip:ipv4"
              ]?.addresses?.address?.[0]?.ip
            }
            rules={[
              { required: true, message: "Введите IP" },
              {
                pattern: ipv4Regex,
                message: "Некорректный формат IP-адреса",
              },
            ]}
          >
            <Input placeholder="192.168.1.10" />
          </Form.Item>

          <Form.Item
            name="prefixLength"
            label="Префикс"
            rules={[
              { required: true, message: "Введите префикс" },
              {
                pattern: cidrMaskRegex,
                message: "Маска должна быть числом от 0 до 32",
              },
            ]}
            initialValue={
              subinterfaces.subinterface?.[selectedIndex]?.[
                "openconfig-if-ip:ipv4"
              ]?.addresses?.address?.[0]?.config["prefix-length"]
            }
          >
            <Input type="number" placeholder="24" />
          </Form.Item>

          <Form.Item>
            <Flex justify="end">
              <Button
                type="primary"
                htmlType="submit"
                loading={changeInterfaceIp.isPending}
              >
                Применить
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

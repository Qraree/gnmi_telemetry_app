import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStaticRoute } from "../../../api/devices_api.ts";

export interface StaticRouteData {
  prefix: string | null;
  nextHop: string | null;
}

interface Props {
  open: boolean;
  initialData?: StaticRouteData;
  onClose: () => void;
  deviceId: number;
}

export const AddStaticRouteModal = ({
  open,
  initialData,
  onClose,
  deviceId,
}: Props) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData]);

  const handleOk = async () => {
    try {
      const { prefix, nextHop } = await form.validateFields();
      addStaticRouteMutation.mutate({ deviceId, prefix, nextHop });
    } catch (err) {
      message.error("Ошибка при обновлении маршрута");
    }
  };

  const addStaticRouteMutation = useMutation({
    mutationFn: ({
      deviceId,
      prefix,
      nextHop,
    }: {
      deviceId: number;
      prefix: string;
      nextHop: string;
    }) => addStaticRoute(deviceId, prefix, nextHop),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["static_routes"] });
    },
    onSuccess: () => onClose(),
  });

  return (
    <Modal
      open={open}
      title="Добавить маршрут"
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
      loading={addStaticRouteMutation.isPending}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="prefix"
          label="Цель"
          rules={[{ required: true, message: "Введите префикс" }]}
        >
          <Input placeholder="например, 192.168.1.0/24" />
        </Form.Item>
        <Form.Item
          name="nextHop"
          label="Следущий узел"
          rules={[{ required: true, message: "Введите адрес next-hop" }]}
        >
          <Input placeholder="например, 192.168.1.1" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

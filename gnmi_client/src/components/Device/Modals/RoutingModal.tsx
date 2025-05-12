import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";

export interface StaticRouteData {
  prefix: string | null;
  nextHop: string | null;
}

interface Props {
  open: boolean;
  initialData?: StaticRouteData;
  onClose: () => void;
  onSubmit?: (data: StaticRouteData) => void;
}

export const EditStaticRouteModal = ({
  open,
  initialData,
  onClose,
  onSubmit,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await mockUpdateStaticRoute(values);
      message.success("Маршрут обновлён");
      if (onSubmit) await onSubmit(values);
      onClose();
    } catch (err) {
      message.error("Ошибка при обновлении маршрута");
    }
  };

  const mockUpdateStaticRoute = async (data: StaticRouteData) => {
    console.log("Отправка данных на сервер:", data);
    return new Promise((resolve) => setTimeout(resolve, 500)); // мок-задержка
  };

  return (
    <Modal
      open={open}
      title="Редактировать маршрут"
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
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

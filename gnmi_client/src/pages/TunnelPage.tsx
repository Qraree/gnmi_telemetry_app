import { LayoutPage } from "./PageLayout.tsx";
import { Button, Card, Flex, Form, Input, InputNumber } from "antd";

export const TunnelPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <LayoutPage title="VXLAN туннель">
      <Flex justify="center" style={{ width: "100%" }}>
        <Card
          title="Настройка VXLAN"
          className="max-w-xl mx-auto shadow-lg"
          style={{ width: "100%" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              id: 10,
              port: 4789,
            }}
          >
            <Form.Item
              label="Устройство (dev)"
              name="dev"
              tooltip="Необязательно: имя сетевого устройства Linux, используемого как источник туннеля. Если не указано — определяется автоматически."
            >
              <Input placeholder="например, eth0" />
            </Form.Item>

            <Form.Item
              label="Идентификатор сети (VNI, id)"
              name="id"
              tooltip="Целое число. Идентификатор VXLAN-сети. По умолчанию — 10, если не указано."
            >
              <InputNumber min={0} max={16777215} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Интерфейс моста (link)"
              name="link"
              tooltip="Обязательно: имя существующего интерфейса в корневом пространстве имён, с которым будет связано VXLAN-соединение."
              rules={[
                { required: true, message: "Укажите имя интерфейса для моста" },
              ]}
            >
              <Input placeholder="например, br0" />
            </Form.Item>

            <Form.Item
              label="MTU"
              name="mtu"
              tooltip="Необязательно: значение MTU для интерфейса VXLAN. Если не указано — рассчитывается автоматически."
            >
              <InputNumber min={576} max={9000} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="UDP-порт (port)"
              name="port"
              tooltip="Целое число. Порт UDP для VXLAN-туннеля. По умолчанию — 4789, если не указано."
            >
              <InputNumber min={1} max={65535} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Удалённый VTEP IP (remote)"
              name="remote"
              tooltip="Обязательно: IP-адрес удалённого VXLAN-конца (VTEP)."
              rules={[
                { required: true, message: "Укажите IP-адрес удалённого VTEP" },
              ]}
            >
              <Input placeholder="например, 192.0.2.1" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Отправить
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </LayoutPage>
  );
};

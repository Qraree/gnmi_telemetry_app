import { FaCircle } from "react-icons/fa6";
import { Button, Card, Descriptions, Tag } from "antd";
import { OpenConfigInterfaceItem } from "../../../types/yang";

interface IProps {
  interfaceItem: OpenConfigInterfaceItem;
}

export const InterfaceCard = ({ interfaceItem }: IProps) => {
  const { state, config, subinterfaces } = interfaceItem;
  const statusColor = state["admin-status"] === "UP" ? "#4dec34" : "red";

  return (
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaCircle style={{ color: statusColor }} />
          {interfaceItem.name}
        </span>
      }
      extra={[
        <Button key="delete" danger>
          Выключить
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
          {state["last-change"]}
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
          {subinterfaces.subinterface.map((sub, index) => (
            <Card
              key={index}
              size="small"
              type="inner"
              title={`Subinterface ${sub.index}`}
              style={{ marginTop: 10 }}
            >
              {sub["openconfig-if-ip:ipv4"]?.addresses?.address?.map(
                (addr, i) => (
                  <Descriptions
                    key={i}
                    size="small"
                    column={1}
                    bordered
                    style={{ marginBottom: 10 }}
                  >
                    <Descriptions.Item label="IP">
                      {addr.state.ip}/{addr.state["prefix-length"]}
                    </Descriptions.Item>
                    <Descriptions.Item label="Origin">
                      {addr.state.origin}
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
                          {nbr.state.origin}
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
  );
};

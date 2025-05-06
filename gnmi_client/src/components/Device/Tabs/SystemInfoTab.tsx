import { Card, Divider, Typography, Tabs, Space } from "antd";
import { OpenConfigInterface, YangBase } from "../../../types/yang.ts";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../../api/devices_api.ts";
import { useParams } from "react-router";

const { Title, Text } = Typography;

export const SystemInfoTab = () => {
  const { device } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["system"],
    queryFn: () =>
      getDeviceYang<YangBase<OpenConfigInterface>>(Number(device), ["/system"]),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError)
    return <Text type="danger">Ошибка загрузки данных: {String(error)}</Text>;

  const systemData = data?.notification[0].update[0].val;
  const keys = systemData ? Object.keys(systemData) : [];

  const tabItems = keys.map((key, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const value = systemData?.[key];
    return {
      label: key,
      key: index.toString(),
      children: (
        <>
          <Title level={3}>{key}</Title>
          <Card
            size="default"
            style={{
              maxHeight: "70vh",
              overflow: "scroll",
            }}
          >
            <RenderSection data={value} />
          </Card>
          <Divider />
        </>
      ),
    };
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 24,
        padding: 16,
      }}
    >
      <Tabs
        defaultActiveKey="0"
        items={tabItems}
        tabPosition="left"
        style={{ height: "70vh" }}
      />
    </div>
  );
};

function RenderSection({ data }: { data: object }) {
  if (!data) return <Text type="secondary">Нет данных</Text>;

  if (typeof data !== "object") {
    return <Text>{String(data)}</Text>;
  }

  return Object.entries(data).map(([sectionKey, sectionValue]) => (
    <div key={sectionKey} style={{ marginBottom: 16 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        {sectionKey}
      </Title>
      {renderContent(sectionValue)}
    </div>
  ));
}

function renderContent(value: object) {
  if (!value) return <Text type="secondary">Пусто</Text>;

  if (typeof value !== "object") {
    return <Text>{String(value)}</Text>;
  }

  if (Array.isArray(value)) {
    return (
      <Space direction="vertical">
        {value.map((item, i) => (
          <Card size="default" key={i}>
            {renderContent(item)}
          </Card>
        ))}
      </Space>
    );
  }

  return (
    <Space direction="vertical">
      {Object.entries(value).map(([k, v]) => (
        <Card size="default" key={k}>
          <Text strong>{k}: </Text>
          {typeof v === "object" ? renderContent(v) : String(v)}
        </Card>
      ))}
    </Space>
  );
}

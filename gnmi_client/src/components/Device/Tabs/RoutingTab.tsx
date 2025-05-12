import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../../api/devices_api.ts";
import { StaticRouteEntry } from "../../../types/yang.ts";
import { useEffect, useState } from "react";
import { Button, Card, Table, Typography } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import {
  EditStaticRouteModal,
  StaticRouteData,
} from "../Modals/RoutingModal.tsx";

const { Title } = Typography;

export const RoutingTab = () => {
  const { device } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<StaticRouteData>({
    prefix: null,
    nextHop: null,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["static_routes"],
    queryFn: () =>
      getDeviceYang<StaticRouteEntry>(Number(device), [
        `network-instances/network-instance[name=default]/protocols/protocol[name=STATIC]/static-routes/static`,
      ]),
  });

  useEffect(() => {
    console.log("hello?");
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const updates = data?.notification?.[0]?.update || [];

  const tableData = updates.map((update, index) => {
    const val = update.val;

    return {
      key: index,
      prefix:
        val["openconfig-network-instance:prefix"] ??
        val["openconfig-network-instance:config"]?.prefix ??
        update.path.split("static[prefix=")?.[1]?.replace("]", ""),
      nextHops:
        val["openconfig-network-instance:next-hops"]?.["next-hop"] ?? [],
    };
  });

  const columns = [
    {
      title: "Цель",
      dataIndex: "prefix",
      key: "prefix",
    },
    {
      title: "Следующий узел",
      dataIndex: "nextHops",
      key: "nextHops",
      render: (hops: any) => (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {hops.map((hop) => (
            <li key={hop.index}>{hop.config?.["next-hop"]} </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Редактировать",
      key: "actions",
      width: 50,
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<AiOutlineEdit />}
          onClick={() => {
            console.log(record);
            setSelectedRoute({
              prefix: record.prefix,
              nextHop: record.nextHops[0].config["next-hop"],
            });
            handleOpen();
          }}
        />
      ),
    },
  ];

  return (
    <Card
      loading={isLoading}
      title={<Title level={4}>Статические маршруты</Title>}
    >
      {isError ? (
        <Typography.Text type="danger">
          Failed to load static routes.
        </Typography.Text>
      ) : (
        <Table columns={columns} dataSource={tableData} pagination={false} />
      )}
      <EditStaticRouteModal
        open={showModal}
        onClose={handleCancel}
        onSubmit={(data) => {
          console.log(data);
        }}
        initialData={selectedRoute}
      />
    </Card>
  );
};

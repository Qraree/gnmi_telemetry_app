import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteStaticRoute, getDeviceYang } from "../../../api/devices_api.ts";
import { StaticRouteEntry } from "../../../types/yang.ts";
import { useState } from "react";
import { Button, Card, Table, Typography } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import {
  AddStaticRouteModal,
  StaticRouteData,
} from "../Modals/RoutingModal.tsx";
import { useModal } from "../../../hooks/useModal.tsx";
import { DeleteRouteModal } from "../Modals/DeleteRouteModal.tsx";

const { Title } = Typography;

export const RoutingTab = () => {
  const { device } = useParams();
  const { showModal, handleOpen, handleCancel } = useModal();
  const {
    showModal: showWarningModal,
    handleOpen: openDeleteModal,
    handleCancel: cancelDeleteModal,
  } = useModal();
  const queryClient = useQueryClient();

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

  const deleteStaticRouteMutation = useMutation({
    mutationFn: ({ deviceId, prefix }: { deviceId: number; prefix: string }) =>
      deleteStaticRoute(deviceId, prefix),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["static_routes"] });
    },
    onSuccess: () => {
      cancelDeleteModal();
    },
  });

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
      title: "Удаление",
      key: "actions",
      width: 150,
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<AiOutlineDelete color={"red"} />}
          onClick={() => {
            setSelectedRoute({
              prefix: record.prefix,
              nextHop: record.nextHops[0].config["next-hop"],
            });
            openDeleteModal();
          }}
        />
      ),
    },
  ];

  return (
    <Card
      loading={isLoading}
      title={<Title level={4}>Статические маршруты</Title>}
      extra={[
        <Button
          onClick={() => {
            handleOpen();
          }}
          type="primary"
        >
          Добавить
        </Button>,
      ]}
    >
      {isError ? (
        <Typography.Text type="danger">
          Failed to load static routes.
        </Typography.Text>
      ) : (
        <Table columns={columns} dataSource={tableData} pagination={false} />
      )}
      <AddStaticRouteModal
        deviceId={Number(device)}
        open={showModal}
        onClose={handleCancel}
        initialData={selectedRoute}
      />
      <DeleteRouteModal
        open={showWarningModal}
        onClose={cancelDeleteModal}
        isLoading={deleteStaticRouteMutation.isPending}
        onOk={() => {
          if (selectedRoute.prefix) {
            deleteStaticRouteMutation.mutate({
              deviceId: Number(device),
              prefix: selectedRoute.prefix,
            });
          }
        }}
      />
    </Card>
  );
};

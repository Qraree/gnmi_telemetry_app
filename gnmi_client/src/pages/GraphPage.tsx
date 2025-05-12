import { Network } from "vis-network";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConnections, getAllDevices } from "../api/devices_api.ts";
import { Connection, Device, VisEdge } from "../types/device.ts";
import { Checkbox, CheckboxChangeEvent, Flex } from "antd";
import { visConfig } from "../utils/constants.ts";
import { LayoutPage } from "./PageLayout.tsx";
import { useTheme } from "../hooks/useTheme.tsx";
import { GraphModal } from "../components/GraphModal/GraphModal.tsx";

export const GraphPage = () => {
  const visJsRef = useRef(null);
  const { theme } = useTheme();

  const { data: devices } = useQuery({
    queryKey: ["devices"],
    queryFn: getAllDevices,
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: getAllConnections,
  });

  const handleEdgeClick = (edge: VisEdge) => {
    setSelectedEdge(edge);
  };

  const handleShowPort = (value: CheckboxChangeEvent) => {
    setShowPort(value.target.checked);
  };

  const [selectedEdge, setSelectedEdge] = useState<VisEdge | null>(null);
  const [visNodes, setVisNodes] = useState<never[]>([]);
  const [visEdges, setVisEdges] = useState<VisEdge[]>([]);
  const [showPort, setShowPort] = useState<boolean>(true);
  const [physics, setPhysics] = useState<boolean>(false);

  useEffect(() => {
    if (devices && connections) {
      const nodes = devices.map((d: Device) => ({
        id: d.id,
        label: d.name,
        title: `IP: ${d.container_ipv4_address || "—"}`,
        image: d.type == "network" ? "/router.svg" : "/pc.svg",
        shape: "image",
        font: { color: "#a59898" },
      }));

      const edges = connections.map((c: Connection) => ({
        from: c.device1_id,
        to: c.device2_id,
        label: showPort ? `${c.port1} ↔ ${c.port2}` : null,
        title: c.cable || "",
        length: 300,
        fromPort: "Ethernet" + c.port1.at(-1),
        toPort: "Ethernet" + c.port2.at(-1),
        fromDeviceName: devices?.find(
          (device: Device) => device.id === c.device1_id,
        ).name,
        toDeviceName: devices?.find(
          (device: Device) => device.id === c.device2_id,
        ).name,
      }));

      setVisNodes(nodes);
      setVisEdges(edges);
    }
  }, [devices, connections, showPort]);

  useEffect(() => {
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        { nodes: visNodes, edges: visEdges },
        { ...visConfig, physics },
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    network.on("click", function (params) {
      if (params.edges.length > 0 && params.items.length > 0) {
        const edgeId = params.edges[0];

        const targetEdge = visEdges.find((edge) => edge.id === edgeId);
        if (!targetEdge) return;

        showModal();
        handleEdgeClick(targetEdge);
      }
    });
  }, [visJsRef, visNodes, visEdges, physics]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <LayoutPage title="Топология">
      <Flex
        style={{
          height: "95vh",
        }}
      >
        <Flex
          style={{
            backgroundColor: theme.graphBackgroundColor,
            height: "100%",
            width: "80%",
            maxWidth: "100%",
            minWidth: "30%",
            maxHeight: "80%",
            borderRadius: 5,
          }}
        >
          <div ref={visJsRef} style={{ width: "100%" }} />
        </Flex>
        <Flex vertical style={{ width: "20%", padding: 10 }}>
          <Checkbox
            checked={showPort}
            defaultChecked={showPort}
            onChange={(value) => handleShowPort(value)}
          >
            Отображение портов
          </Checkbox>
          <Checkbox
            checked={physics}
            defaultChecked={physics}
            onChange={(value) => setPhysics(value.target.checked)}
          >
            Физическая симуляция
          </Checkbox>
        </Flex>
      </Flex>
      <GraphModal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        selectedEdge={selectedEdge}
      />
    </LayoutPage>
  );
};

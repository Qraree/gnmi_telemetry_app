import { Network } from "vis-network";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConnections, getAllDevices } from "../api/devices_api.ts";
import { Connection, Device, VisEdge } from "../types/device.ts";
import { Flex } from "antd";
import { visConfig } from "../utils/constants.ts";
import { GraphModal } from "../components/GraphModal/GraphModal.tsx";
import { LayoutPage } from "./PageLayout.tsx";
import { useTheme } from "../hooks/useTheme.tsx";

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
    setModalVisible(true);
    setSelectedEdge(edge);
  };

  const [selectedEdge, setSelectedEdge] = useState<VisEdge | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [visNodes, setVisNodes] = useState<never[]>([]);
  const [visEdges, setVisEdges] = useState<VisEdge[]>([]);

  useEffect(() => {
    if (devices && connections) {
      const nodes = devices.map((d: Device) => ({
        id: d.id,
        label: d.name.slice(15),
        title: `IP: ${d.container_ipv4_address || "—"}`,
        image: "/router.svg",
        shape: "image",
        font: { color: "#a59898" },
      }));

      const edges = connections.map((c: Connection) => ({
        from: c.device1_id,
        to: c.device2_id,
        label: `${c.port1} ↔ ${c.port2}`,
        title: c.cable || "",
        length: 200,
      }));

      setVisNodes(nodes);
      setVisEdges(edges);
    }
  }, [devices, connections]);

  useEffect(() => {
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        { nodes: visNodes, edges: visEdges },
        visConfig,
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    network.on("click", function (params) {
      if (params.edges.length > 0 && params.items.length > 0) {
        const edgeId = params.edges[0];

        const targetEdge = visEdges.find((edge) => edge.id === edgeId);
        if (!targetEdge) return;

        handleEdgeClick(targetEdge);
      }
    });
  }, [visJsRef, visNodes, visEdges]);

  return (
    <LayoutPage title="Network Devices Graph">
      <div
        style={{
          height: "100vh",
        }}
      >
        <Flex
          style={{
            backgroundColor: theme.graphBackgroundColor,
            height: "100%",
            width: "100%",
            maxWidth: "100%",
            minWidth: "30%",
            maxHeight: "80%",
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div ref={visJsRef} style={{ width: "100%" }} />
          <GraphModal
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            selectedEdge={selectedEdge}
          />
        </Flex>
      </div>
    </LayoutPage>
  );
};

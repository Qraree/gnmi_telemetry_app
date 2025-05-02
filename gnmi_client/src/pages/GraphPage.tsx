import { Network } from "vis-network";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConnections, getAllDevices } from "../api/devices_api.ts";
import { Connection, Device, VisEdge } from "../types/device.ts";
import { Flex } from "antd";
import { visConfig } from "../utils/constants.ts";

export const GraphPage = () => {
  const visJsRef = useRef(null);

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
    console.log(edge);
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
        font: { color: "#ffffff" },
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
    <div
      className="p-9 "
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ color: "white", fontSize: "36px" }}>
        Network Devices Graph
      </h1>
      <Flex
        dir="row"
        style={{
          borderColor: "white",
          backgroundColor: "#414143",
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          minWidth: "30%",
          maxHeight: "512px",
          marginBottom: 50,
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div ref={visJsRef} style={{ width: "100%" }} />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "30%",
            background: "#79898e",
            padding: 15,
            transition: "transform 0.3s ease-in-out",
            transform: isModalVisible ? "translateX(0)" : "translateX(100%)",
            boxShadow: isModalVisible ? "-4px 0 10px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <Flex dir="column">
            <Flex dir="row" justify="space-between" style={{ width: "100%" }}>
              <div>{selectedEdge?.label}</div>
              <div
                onClick={() => setModalVisible(false)}
                style={{ cursor: "pointer" }}
              >
                x
              </div>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

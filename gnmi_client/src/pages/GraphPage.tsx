import { Network } from "vis-network";
import { useEffect, useRef } from "react";

export const GraphPage = () => {
  const nodes = [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
  ];

  const edges = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ];

  const visJsRef = useRef(null);
  useEffect(() => {
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        { nodes, edges },
        {
          autoResize: true,
          edges: {
            color: "#efe9e9",
          },
        },
      );
  }, [visJsRef, nodes, edges]);

  return (
    <div
      className="p-9 "
      style={{
        height: "100%",
      }}
    >
      <h1 style={{ color: "white", fontSize: "36px" }}>
        Network Devices Graph
      </h1>
      <div
        ref={visJsRef}
        style={{
          borderWidth: "1px",
          borderColor: "white",
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          minWidth: "30%",
          maxHeight: "512px",
        }}
      />
    </div>
  );
};

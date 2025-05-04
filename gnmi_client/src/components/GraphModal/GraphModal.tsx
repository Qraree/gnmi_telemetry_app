import { Flex } from "antd";
import { VisEdge } from "../../types/device.ts";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { RouterSVG } from "../../assets/RouterSVG.tsx";
import styles from "./GraphModal.module.css";
import { useTheme } from "../../hooks/useTheme.tsx";

interface GraphModalProps {
  isModalVisible: boolean;
  selectedEdge: VisEdge | null;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GraphModal = ({
  isModalVisible,
  setModalVisible,
  selectedEdge,
}: GraphModalProps) => {
  const { theme } = useTheme();
  return (
    <div
      className={styles.modal}
      style={{
        background: theme.colorFillSecondary,
        transform: isModalVisible ? "translateX(0)" : "translateX(100%)",
        boxShadow: isModalVisible ? "-4px 0 10px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <Flex justify="space-between" style={{ width: "100%" }}>
        <div>{selectedEdge?.label}</div>
        <IoCloseOutline
          onClick={() => setModalVisible(false)}
          style={{ cursor: "pointer", fontSize: 24 }}
        />
      </Flex>
      <div style={{ padding: 20 }}>
        <Flex justify={"space-around"}>
          <Flex vertical align="center" style={{ height: 200 }}>
            <RouterSVG />
            <div>{selectedEdge?.label}</div>
          </Flex>
          <div
            style={{
              background: theme.colorPrimaryText,
              width: "60%",
              height: "1px",
              marginTop: 25,
            }}
          ></div>
          <Flex vertical align="center" style={{ height: 200 }}>
            <RouterSVG />
            <p>{selectedEdge?.label}</p>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

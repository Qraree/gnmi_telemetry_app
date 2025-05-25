import { ReactNode } from "react";
import { Flex, Typography } from "antd";

interface Props {
  title: string;
  children?: ReactNode;
  width: number | string;
  height: number;
}

export const ChartLayout = ({ children, title, width, height }: Props) => {
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        width,
        height,
      }}
    >
      <Typography.Title level={4}>{title}</Typography.Title>
      <div
        style={{
          width: "100%",
          height,
          border: "1px solid #ccc",
          padding: 5,
        }}
      >
        {children}
      </div>
    </Flex>
  );
};

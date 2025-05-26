import { Flex, Typography } from "antd";
import { ReactNode } from "react";

interface SectionLayoutProps {
  title: string;
  children: ReactNode;
}

export const SectionLayout = ({ title, children }: SectionLayoutProps) => {
  return (
    <Flex>
      <Flex vertical style={{ width: "100%" }}>
        <Typography.Title level={2}>{title}</Typography.Title>
        {children}
      </Flex>
    </Flex>
  );
};

import React from "react";
import { useTheme } from "../hooks/useTheme.tsx";
import { Breadcrumb } from "antd";
import { useBreads } from "../hooks/useBreads.tsx";

interface IProps {
  title: string;
  children?: React.ReactNode;
}

export const LayoutPage = ({ title, children }: IProps) => {
  const { theme } = useTheme();
  const breads = useBreads();

  return (
    <div>
      <div
        style={{
          backgroundColor: theme.primaryColor,
          padding: "32px",
          minHeight: "100vh",
          color: theme.colorPrimaryText,
        }}
      >
        <Breadcrumb items={breads}></Breadcrumb>
        <div style={{ margin: "0 auto", maxWidth: "100%" }}>
          <h1
            style={{
              color: theme.colorPrimaryText,
              fontSize: "36px",
              marginBottom: "24px",
            }}
          >
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};

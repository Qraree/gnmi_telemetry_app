import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router";

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
  backgroundColor: "#100f0f",
  paddingTop: "10px",
  borderRight: "1px solid #7f807e",
};

const items: MenuProps["items"] = [
  {
    key: 0,
    label: <Link to="/devices">Список устройств</Link>,
  },
  {
    key: 1,
    label: <Link to="/graph">Схема устройств</Link>,
  },
];

export const MainPage: React.FC = () => {
  return (
    <Layout hasSider style={{ backgroundColor: "#100f0f" }}>
      <Sider style={siderStyle} theme="light">
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["/devices"]}
          items={items}
          style={{ backgroundColor: "#100f0f" }}
        />
      </Sider>
      <Layout>
        <Content style={{ overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

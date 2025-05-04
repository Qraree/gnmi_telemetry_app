import React from "react";
import { Flex, Layout, Menu, MenuProps, Switch } from "antd";
import { Link, Outlet, useLocation } from "react-router";
import { FaMoon, FaSun } from "react-icons/fa6";
import styles from "./MainPage.module.css";
import { useTheme } from "../../hooks/useTheme.tsx";
import {
  darkThemeConfig,
  lightThemeConfig,
  ThemeColor,
} from "../../utils/constants.ts";

const { Content, Sider } = Layout;

const items: MenuProps["items"] = [
  {
    key: "/devices",
    label: <Link to="/devices">Список устройств</Link>,
  },
  {
    key: "/graph",
    label: <Link to="/graph">Схема устройств</Link>,
  },
  {
    key: "/monitoring",
    label: (
      <Link to="http://localhost:3001" target="_blank">
        Мониторинг
      </Link>
    ),
  },
];

export const MainPage: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const setThemeHandler = (switchResult: boolean) => {
    const targetTheme = switchResult ? lightThemeConfig : darkThemeConfig;
    setTheme(targetTheme);
  };

  return (
    <Layout hasSider style={{ backgroundColor: theme.primaryColor }}>
      <Sider
        style={{
          backgroundColor: theme.primaryColor,
          borderColor: theme.theme === ThemeColor.light ? "#d6d4d4" : "#d6d4d4",
        }}
        className={styles.sider}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={items}
          style={{ backgroundColor: theme.primaryColor, border: "none" }}
        />
        <Flex vertical style={{ width: "100%", height: "82%" }} justify="end">
          <Switch
            style={{ width: "20%", marginLeft: 10 }}
            checkedChildren={<FaSun style={{ marginTop: 5 }} />}
            unCheckedChildren={<FaMoon style={{ marginTop: 0 }} />}
            defaultChecked
            onChange={setThemeHandler}
          />
        </Flex>
      </Sider>
      <Layout>
        <Content style={{ overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

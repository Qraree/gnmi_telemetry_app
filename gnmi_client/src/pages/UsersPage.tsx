import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users.ts";
import { useEffect } from "react";
import { Button, Flex, Table } from "antd";
import { LayoutPage } from "./PageLayout.tsx";
import { Link } from "react-router";

export const UsersPage = () => {
  const { data } = useQuery({
    queryKey: ["users_all"],
    queryFn: getAllUsers,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Группа",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "",
      key: "info",
      width: 200,
      render: () => (
        <Flex justify="center" align="center" gap={20}>
          <Link to="/labs/hello2">Топология</Link>
          <Button danger>Удалить</Button>
        </Flex>
      ),
    },
  ];

  return (
    <LayoutPage title="Пользователи">
      {data && <Table columns={columns} dataSource={data?.data} />}
    </LayoutPage>
  );
};

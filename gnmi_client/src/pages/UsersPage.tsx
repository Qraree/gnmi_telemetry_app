import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteUser, getAllUsers } from "../api/users.ts";
import { useEffect, useState } from "react";
import { Button, Flex, Modal, Table } from "antd";
import { LayoutPage } from "./PageLayout.tsx";
import { Link } from "react-router";
import { useModal } from "../hooks/useModal.tsx";
import { AddUserModal } from "../components/Users/AddUserModal.tsx";

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["users_all"],
    queryFn: getAllUsers,
  });

  const { showModal, handleOpen, handleCancel } = useModal();
  const {
    showModal: showAddUser,
    handleOpen: handleOpenAddUser,
    handleCancel: handleCancelADdUser,
  } = useModal();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    mutationKey: ["delete_users"],
    onSuccess: async () => {
      handleCancel();
      await queryClient.refetchQueries({ queryKey: ["users_all"] });
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
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
      render: (value) => (
        <Flex justify="center" align="center" gap={20}>
          <Link to="/labs/hello2">Топология</Link>
          <Button
            danger
            onClick={() => {
              setSelectedUser(value.id);
              handleOpen();
            }}
          >
            Удалить
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <LayoutPage title="Пользователи">
      <Flex justify="end" align="center" onClick={() => handleOpenAddUser()}>
        <Button type="primary">Добавить пользователя</Button>
      </Flex>
      {data && <Table columns={columns} dataSource={data?.data} />}
      <Modal
        open={showModal}
        onCancel={handleCancel}
        onOk={() => deleteUserMutation.mutate(String(selectedUser))}
      >
        Вы уверены, что хотите удалить пользователя
      </Modal>
      <AddUserModal open={showAddUser} onClose={handleCancelADdUser} />
    </LayoutPage>
  );
};

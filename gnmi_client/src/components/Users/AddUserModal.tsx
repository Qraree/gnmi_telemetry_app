import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "../../api/users.ts";

interface AddUserModalProps {
  onClose: () => void;
  open: boolean;
}

export const AddUserModal = ({ open, onClose }: AddUserModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const addUserMutation = useMutation({
    mutationFn: ({ name, group }: { name: string; group: string }) =>
      addUser(name, group),
    onSuccess: async () => {
      setLoading(false);
      onClose();
      await queryClient.refetchQueries({ queryKey: ["users_all"] });
    },
  });

  const onFinish = (values: { name: string; group: string }) => {
    try {
      setLoading(true);
      addUserMutation.mutate({ name: values.name, group: values.group });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={false} destroyOnClose={true}>
      <Form
        form={form}
        name="add_user_form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Имя пользователя"
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите имя пользователя!",
            },
            { min: 2, message: "Имя должно содержать минимум 2 символа" },
            { max: 50, message: "Имя не должно превышать 50 символов" },
          ]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item
          label="Группа"
          name="group"
          rules={[
            { required: true, message: "Пожалуйста, введите группу!" },
            { pattern: /^[a-zA-Z0-9]+$/, message: "Только буквы и цифры" },
          ]}
        >
          <Input placeholder="Введите номер группы" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Добавить пользователя
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

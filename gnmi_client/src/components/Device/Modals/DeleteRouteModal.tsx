import { Modal, Typography } from "antd";

interface Props {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const DeleteRouteModal = ({ open, onOk, onClose, isLoading }: Props) => {
  return (
    <Modal
      open={open}
      title="Удаление маршрута"
      onCancel={onClose}
      onOk={onOk}
      okText="Сохранить"
      cancelText="Отмена"
      loading={isLoading}
    >
      <Typography.Text>Вы уверены, что хотите удалить маршрут?</Typography.Text>
    </Modal>
  );
};

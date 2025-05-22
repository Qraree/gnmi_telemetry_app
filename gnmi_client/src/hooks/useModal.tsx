import { useState } from "react";

export const useModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return {
    showModal,
    handleOpen,
    handleCancel,
  };
};

import { Context } from "../context";
import { useContext } from "react";

let resolveCallback;
export default function useConfirm() {
  const { confirmModal, setConfirmModal, text, setText } = useContext(Context);

  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };

  const confirm = async (newText) => {
    setConfirmModal(true);
    setText(newText);
    return new Promise((res) => {
      resolveCallback = res;
    });
  };

  const closeConfirm = () => {
    setText("");
    setConfirmModal(false);
  };

  return {
    confirm,
    onConfirm,
    onCancel,
    confirmModal,
    text,
  };
}

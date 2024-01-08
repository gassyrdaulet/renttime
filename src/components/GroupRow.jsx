import { BsPencil } from "react-icons/bs";
import { useState, useEffect } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import cl from "../styles/Groups.module.css";
import Modal from "./Modal";
import { deleteGroup, editGroup } from "../api/GoodsApi";
import useAuth from "../hooks/useAuth";
import ConfirmModal from "./ConfirmModal";

function GroupRow({ className, name, setGroup, id, next = () => {} }) {
  const [editGroupModal, setEditGroupModal] = useState(false);
  const [groupName, setGroupName] = useState(name);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    setGroupName(name);
  }, [editGroupModal, name]);

  return (
    <div>
      <p
        className={cl.GroupName + " " + className}
        onClick={() => setGroup(id)}
      >
        {name}
        <BsPencil onClick={() => setEditGroupModal(!editGroupModal)} />
      </p>
      <Modal
        onlyByClose={true}
        title={`Редактирование группы ${id}: "${name}"`}
        modalVisible={editGroupModal}
        setModalVisible={setEditGroupModal}
        noEscape={editLoading || deleteLoading || confirmDeleteModal}
      >
        <form className={cl.EditForm}>
          <MyInput
            label="Название группы"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={editLoading}
          />
          <div className={cl.EditFormButtons}>
            <MyButton
              margin="0"
              type="submit"
              text="Сохранить"
              disabled={editLoading || name === groupName}
              loading={String(editLoading)}
              onClick={(e) => {
                e.preventDefault();
                editGroup(
                  setEditLoading,
                  token,
                  { group_id: id, name: groupName },
                  () => {
                    setEditGroupModal(false);
                    next();
                  }
                );
              }}
            />
            <MyButton
              margin="0 0 0 5px"
              text="Удалить группу"
              onClick={(e) => {
                e.preventDefault();
                setConfirmDeleteModal(true);
              }}
              loading={String(deleteLoading)}
              disabled={editLoading}
              color={{ default: "#f45e42", dark: "#e84e35" }}
            />
          </div>
        </form>
      </Modal>
      <ConfirmModal
        visible={confirmDeleteModal}
        setVisible={setConfirmDeleteModal}
        loading={deleteLoading}
        title="Подтвердите действие"
        question="Вы действительно хотите удалить эту группу? Все карточки состоящие в
        ней останутся без группы."
        onConfirm={() => {
          deleteGroup(setDeleteLoading, token, id, () => {
            setEditGroupModal(false);
            setConfirmDeleteModal(false);
            next();
          });
        }}
      />
    </div>
  );
}

export default GroupRow;

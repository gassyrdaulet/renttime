import { BsPencil } from "react-icons/bs";
import { useState, useEffect } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import cl from "../styles/Groups.module.css";
import Modal from "./Modal";
import { deleteGroup, editGroup } from "../api/GoodsApi";
import useAuth from "../hooks/useAuth";

function GroupRow({ className, name, setGroup, id, navigate }) {
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
              text="Удалить группу"
              onClick={(e) => {
                e.preventDefault();
                setConfirmDeleteModal(true);
              }}
              loading={String(deleteLoading)}
              disabled={editLoading}
              color={{ default: "#f45e42", dark: "#e84e35" }}
            />
            <MyButton
              margin="0 0 0 5px"
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
                  () => navigate(0)
                );
              }}
            />
          </div>
        </form>
      </Modal>
      <Modal
        title="Подтвердите действие"
        modalVisible={confirmDeleteModal}
        setModalVisible={setConfirmDeleteModal}
        noEscape={deleteLoading}
      >
        <p>
          Вы действительно хотите удалить эту группу? Все карточки состоящие в
          ней останутся без группы.
        </p>
        <div className={"ConfirmButtonsContainer"}>
          <MyButton
            text="Нет"
            color={{ default: "#f45e42", dark: "#e84e35" }}
            disabled={deleteLoading}
            onClick={() => {
              setConfirmDeleteModal(false);
            }}
          />
          <MyButton
            text="Да"
            color={{ default: "#85c442", dark: "#7ab835" }}
            disabled={deleteLoading}
            onClick={() => {
              deleteGroup(setDeleteLoading, token, id, () => navigate(0));
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default GroupRow;

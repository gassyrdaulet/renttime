import { useState, useMemo, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  grantPrivilege,
} from "../api/OrganizationApi";
import FormLayout from "./FormLayout";
import TableLayout from "./TableLayout";
import { BiCheckboxChecked, BiCheckbox, BiX } from "react-icons/bi";
import Modal from "./Modal";
import Loading from "./Loading";
import styled from "styled-components";
import CredButtons from "./CredButtons";
import { FaPlusSquare } from "react-icons/fa";
import MyInput from "./MyInput";
import Switch from "./Switch";
import ConfirmModal from "./ConfirmModal";

const CheckBoxWrapper = styled.div`
  display: block;
  width: 100%;
  color: ${(props) => props.disabled && "gray"};
`;
const CredButtonsWrapper = styled.div`
  width: 400px;
  max-width: 400px;
  margin-bottom: 20px;
`;

function EditUsersForm({ isLoading, setIsLoading }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("0");
  const [editLoading, setEditLoading] = useState(false);
  const [addNewUserModal, setAddNewUserModal] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState({});
  const [grantPrivilegeLoading, setGrantPrivilegeLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({});

  const getAllUsersCallback = useCallback(() => {
    getAllUsers(setIsLoading, token, setUsers);
  }, [token, setIsLoading]);

  const handleRolesCheck = useCallback((key) => {
    setCheckedRoles((prev) => {
      const temp = { ...prev };
      if (temp[key]) {
        delete temp[key];
        return temp;
      }
      temp[key] = true;
      return temp;
    });
  }, []);

  const handleConfirmDeleteModal = useCallback((id, value) => {
    setConfirmDeleteModal((prev) => {
      const temp = { ...prev };
      if (temp[id]) {
        temp[id] = value;
        return temp;
      }
      temp[id] = value;
      return temp;
    });
  }, []);

  useEffect(() => {
    getAllUsersCallback();
  }, [getAllUsersCallback]);

  useEffect(() => {
    setUserId(0);
    setCheckedRoles({});
  }, [addNewUserModal]);

  const addUserButtons = useMemo(
    () => [
      {
        id: 1,
        text: "Добавить",
        type: "submit",
        loading: editLoading,
        disabled: editLoading,
        onClick: (e) => {
          e.preventDefault();
          addNewUser(setEditLoading, token, userId, checkedRoles, () => {
            setAddNewUserModal(false);
            getAllUsersCallback();
          });
        },
      },
    ],
    [editLoading, token, checkedRoles, userId, getAllUsersCallback]
  );
  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Новый пользователь",
        icon: <FaPlusSquare color="#0F9D58" size={20} />,
        onClick: () => {
          setAddNewUserModal(true);
        },
      },
    ],
    []
  );
  const roles = useMemo(
    () => [
      { id: "owner", title: "ВЛАДЕЛЕЦ", editable: false },
      { id: "admin", title: "АДМИН", editable: true },
      { id: "manager", title: "МЕНЕДЖЕР", editable: true },
      { id: "courier", title: "КУРЬЕР", editable: true },
      { id: "debt", title: "ДАВАТЬ В ДОЛГ", editable: true },
    ],
    []
  );

  const headers = useMemo(
    () => [
      {
        id: "index",
        style: {
          fixedMinWidth: "60px",
          fixedJustWidth: "60px",
          fixedMaxWidth: "60px",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "name",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
          columnPosition: "sticky",
          left: -1,
        },
        title: "ИМЯ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "cellphone",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "НОМЕР ТЕЛЕФОНА",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      ...roles.map((item) => ({
        id: item.id,
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: item.title,
        type: "other",
        children: ({ dataItem }) => {
          return (
            <CheckBoxWrapper
              disabled={item.id === "owner" || grantPrivilegeLoading}
              onClick={() => {
                if (!grantPrivilegeLoading && item.id !== "owner") {
                  grantPrivilege(
                    (v) => {
                      if (v) setGrantPrivilegeLoading(true);
                    },
                    token,
                    dataItem.userId,
                    item.id,
                    () => {
                      getAllUsers(setGrantPrivilegeLoading, token, setUsers);
                    }
                  );
                }
              }}
            >
              {dataItem[item.id] ? (
                <BiCheckboxChecked size={25} />
              ) : (
                <BiCheckbox size={25} />
              )}
            </CheckBoxWrapper>
          );
        },
      })),
      {
        id: "deleteUserButton",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: "ВЫГНАТЬ",
        type: "other",
        children: ({ dataItem }) => {
          return (
            <CheckBoxWrapper
              disabled={
                grantPrivilegeLoading ||
                editLoading ||
                confirmDeleteModal[dataItem.id]
              }
              onClick={() => {
                if (
                  !grantPrivilegeLoading &&
                  !editLoading &&
                  !confirmDeleteModal[dataItem.id]
                ) {
                  handleConfirmDeleteModal(dataItem.id, true);
                }
              }}
            >
              <BiX size={25} color="red" />
              <ConfirmModal
                visible={confirmDeleteModal[dataItem.id]}
                setVisible={(v) => {
                  handleConfirmDeleteModal(dataItem.id, v);
                }}
                loading={editLoading}
                title="Выгнать пользователя"
                question={`Вы уверены что хотите выгнать этого пользователя из организации? (ID: ${dataItem.userId})`}
                onConfirm={(e) => {
                  e.preventDefault();
                  deleteUser(setEditLoading, token, dataItem.userId, () => {
                    handleConfirmDeleteModal(dataItem.id, false);
                    getAllUsersCallback();
                  });
                }}
              />
            </CheckBoxWrapper>
          );
        },
      },
    ],
    [
      roles,
      getAllUsersCallback,
      grantPrivilegeLoading,
      token,
      editLoading,
      confirmDeleteModal,
      handleConfirmDeleteModal,
    ]
  );
  const dataForTable = useMemo(
    () =>
      users.map((item, index) => {
        return {
          id: item.id,
          userId: item.user_id,
          index: index + 1,
          name: item.userInfo?.name,
          cellphone: item.userInfo?.cellphone,
          owner: item.owner,
          admin: item.admin,
          courier: item.courier,
          manager: item.manager,
          debt: item.debt,
        };
      }),
    [users]
  );

  if (isLoading) {
    return (
      <div className="LoadingWrapper2">
        <Loading which="gray" />
      </div>
    );
  }

  return (
    <div>
      <CredButtonsWrapper>
        <CredButtons
          credButtons={credButtons}
          disabled={isLoading || editLoading}
        />
      </CredButtonsWrapper>
      <FormLayout
        width="100%"
        height="inherit"
        mobileMaxWidth="100%"
        firstHalf={
          <div>
            <TableLayout headers={headers} data={dataForTable} />
          </div>
        }
        buttons={[]}
      />
      <Modal
        title="Новый пользователь"
        setModalVisible={setAddNewUserModal}
        modalVisible={addNewUserModal}
        noEscape={isLoading || editLoading}
        onlyByClose={true}
      >
        <FormLayout
          firstHalf={
            <div>
              <MyInput
                label="ID пользователя"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={editLoading}
                integer={true}
                unsigned={true}
                max={9999999999}
              />
              {roles.map(
                (item) =>
                  item.editable && (
                    <Switch
                      key={item.id}
                      label={item.title}
                      isChecked={
                        checkedRoles[item.id] ? checkedRoles[item.id] : false
                      }
                      setChecked={() => handleRolesCheck(item.id)}
                    />
                  )
              )}
            </div>
          }
          buttons={addUserButtons}
        />
      </Modal>
    </div>
  );
}

export default EditUsersForm;

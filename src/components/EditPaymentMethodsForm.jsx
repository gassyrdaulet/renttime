import { useState, useMemo, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import {
  deleteMethod,
  editMethod,
  editMethodOption,
  getMethods,
  newMethod,
} from "../api/OrganizationApi";
import FormLayout from "./FormLayout";
import TableLayout from "./TableLayout";
import { BiCheckboxChecked, BiCheckbox, BiX, BiCheck } from "react-icons/bi";
import Modal from "./Modal";
import Loading from "./Loading";
import styled from "styled-components";
import CredButtons from "./CredButtons";
import { FaPlusSquare } from "react-icons/fa";
import MyInput from "./MyInput";
import Switch from "./Switch";
import ConfirmModal from "./ConfirmModal";

const OtherWrapper = styled.div`
  display: block;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.disabled && "gray"};
`;
const CredButtonsWrapper = styled.div`
  width: 400px;
  max-width: 400px;
  margin-bottom: 20px;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function EditPaymentMethodsForm({ isLoading, setIsLoading }) {
  const { token } = useAuth();
  const [methods, setMethods] = useState([]);
  const [name, setName] = useState("");
  const [checkedOptions, setCheckedOptions] = useState({});
  const [optionsChangeLoading, setOptionsChangeLoading] = useState(false);
  const [comission, setComission] = useState("0");
  const [editLoading, setEditLoading] = useState(false);
  const [addNewMethodModal, setAddNewMethodModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({});
  const [editInputId, setEditInputId] = useState();
  const [input, setInput] = useState("");

  const getMethodsCallback = useCallback(() => {
    getMethods(setIsLoading, token, setMethods);
  }, [token, setIsLoading]);

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

  const handleOptionsCheck = useCallback((key) => {
    setCheckedOptions((prev) => {
      const temp = { ...prev };
      if (temp[key]) {
        delete temp[key];
        return temp;
      }
      temp[key] = true;
      return temp;
    });
  }, []);

  useEffect(() => {
    getMethodsCallback();
  }, [getMethodsCallback]);

  const addMethodButtons = useMemo(
    () => [
      {
        id: 1,
        text: "Добавить",
        type: "submit",
        loading: editLoading,
        disabled: editLoading,
        onClick: (e) => {
          e.preventDefault();
          newMethod(
            setEditLoading,
            token,
            { name, comission, ...checkedOptions },
            () => {
              setAddNewMethodModal(false);
              getMethodsCallback();
            }
          );
        },
      },
    ],
    [editLoading, token, name, comission, getMethodsCallback, checkedOptions]
  );

  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Новый метод оплаты",
        icon: <FaPlusSquare color="#0F9D58" size={20} />,
        onClick: () => {
          setAddNewMethodModal(true);
        },
      },
    ],
    []
  );
  const options = useMemo(
    () => [
      {
        id: "courier_access",
        title: "Принимается курьерами",
        editable: !optionsChangeLoading,
      },
    ],
    [optionsChangeLoading]
  );

  const headers = useMemo(
    () => [
      {
        id: "index",
        style: {
          fixedMinWidth: "40px",
          fixedJustWidth: "40px",
          fixedMaxWidth: "40px",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "nameEdit",
        style: {
          fixedMinWidth: "150px",
          fixedJustWidth: "150px",
          fixedMaxWidth: "150px",
          columnPosition: "sticky",
          left: -1,
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: "ИМЯ",
        type: "other",
        children: ({ dataItem }) => {
          return (
            <OtherWrapper
              onClick={() => {
                if (
                  editInputId?.id === dataItem.id &&
                  editInputId?.key === "name"
                )
                  return;
                setEditInputId({ ...dataItem, key: "name" });
              }}
            >
              {editInputId?.key === "name" && editInputId.id === dataItem.id ? (
                <InputWrapper>
                  <MyInput
                    margin="0"
                    fontSize={11}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={editLoading}
                  />
                  <div>
                    <BiCheck
                      onClick={() =>
                        editMethod(
                          setEditLoading,
                          token,
                          { name: input, method_id: dataItem.id },
                          () => {
                            setEditInputId({});
                            getMethods(setEditLoading, token, setMethods);
                          }
                        )
                      }
                      size={20}
                    />
                    <BiX onClick={() => setEditInputId({})} size={20} />
                  </div>
                </InputWrapper>
              ) : (
                dataItem.name
              )}
            </OtherWrapper>
          );
        },
      },
      {
        id: "comissionEdit",
        style: {
          fixedMinWidth: "150px",
          fixedJustWidth: "150px",
          fixedMaxWidth: "150px",
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: "КОМИССИЯ",
        type: "other",
        children: ({ dataItem }) => {
          return (
            <OtherWrapper
              onClick={() => {
                if (
                  editInputId?.id === dataItem.id &&
                  editInputId?.key === "comission"
                )
                  return;
                setEditInputId({ ...dataItem, key: "comission" });
              }}
            >
              {editInputId?.key === "comission" &&
              editInputId.id === dataItem.id ? (
                <InputWrapper>
                  <MyInput
                    margin="0"
                    fontSize={11}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={editLoading}
                  />
                  <div>
                    <BiCheck
                      onClick={() =>
                        editMethod(
                          setEditLoading,
                          token,
                          { comission: input, method_id: dataItem.id },
                          () => {
                            setEditInputId({});
                            getMethods(setEditLoading, token, setMethods);
                          }
                        )
                      }
                      size={20}
                    />
                    <BiX onClick={() => setEditInputId({})} size={20} />
                  </div>
                </InputWrapper>
              ) : (
                dataItem.comission + " %"
              )}
            </OtherWrapper>
          );
        },
      },
      ...options.map((item) => ({
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
            <OtherWrapper
              disabled={!item.editable}
              onClick={() => {
                if (item.editable) {
                  editMethodOption(
                    (v) => {
                      if (v) setOptionsChangeLoading(true);
                    },
                    token,
                    dataItem.id,
                    item.id,
                    () => {
                      getMethods(setOptionsChangeLoading, token, setMethods);
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
            </OtherWrapper>
          );
        },
      })),
      {
        id: "deleteUserButton",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: "УДАЛИТЬ",
        type: "other",
        children: ({ dataItem }) => {
          return (
            <OtherWrapper
              disabled={editLoading || confirmDeleteModal[dataItem.id]}
              onClick={() => {
                if (!editLoading && !confirmDeleteModal[dataItem.id]) {
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
                title="Удаление метода"
                question={`Вы уверены что хотите удалить этот метод оплаты (${dataItem.name})`}
                onConfirm={(e) => {
                  e.preventDefault();
                  deleteMethod(setEditLoading, token, dataItem.id, () => {
                    setConfirmDeleteModal(false);
                    getMethodsCallback();
                  });
                }}
              />
            </OtherWrapper>
          );
        },
      },
    ],
    [
      editInputId,
      input,
      options,
      getMethodsCallback,
      token,
      editLoading,
      confirmDeleteModal,
      handleConfirmDeleteModal,
    ]
  );
  const dataForTable = useMemo(
    () =>
      methods.map((item, index) => {
        return {
          id: item.id,
          index: index + 1,
          name: item?.name,
          comission: item.comission,
          courier_access: item.courier_access,
        };
      }),
    [methods]
  );

  useEffect(() => {
    setName("");
    setComission("0");
    setCheckedOptions({});
  }, [addNewMethodModal]);

  useEffect(() => {
    setInput(
      editInputId?.[editInputId?.key] ? editInputId?.[editInputId?.key] : ""
    );
  }, [editInputId]);

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
        title="Новый метод оплаты"
        setModalVisible={setAddNewMethodModal}
        modalVisible={addNewMethodModal}
        noEscape={isLoading || editLoading}
        onlyByClose={true}
      >
        <FormLayout
          firstHalf={
            <div>
              <MyInput
                label="Название метода оплаты"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={editLoading}
              />
              <MyInput
                label="Комиссия"
                value={comission}
                onChange={(e) => setComission(e.target.value)}
                disabled={editLoading}
              />
              {options.map(
                (item) =>
                  item.editable && (
                    <Switch
                      key={item.id}
                      label={item.title}
                      isChecked={
                        checkedOptions[item.id]
                          ? checkedOptions[item.id]
                          : false
                      }
                      setChecked={() => handleOptionsCheck(item.id)}
                    />
                  )
              )}
            </div>
          }
          buttons={addMethodButtons}
        />
      </Modal>
    </div>
  );
}

export default EditPaymentMethodsForm;

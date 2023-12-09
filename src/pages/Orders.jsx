import { useState, useMemo } from "react";
import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import Modal from "../components/Modal";
import { FaPlusSquare } from "react-icons/fa";
import CreateNewOrder from "../components/CreateNewOrder";

function Orders() {
  const [createOrderModal, setCreateOrderModal] = useState(false);
  const [createNewOrderLoading, setCreateNewOrderLoading] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");

  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Новая заявка",
        icon: <FaPlusSquare color="#0F9D58" size={20} />,
        onClick: () => {
          setCreateOrderModal(true);
        },
      },
    ],
    []
  );

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
    </div>
  );

  const mainContent = (
    <div>
      <Modal
        modalVisible={createOrderModal}
        setModalVisible={setCreateOrderModal}
        title="Создание нового заказа"
        onlyByClose={true}
        noEscape={createNewOrderLoading}
      >
        <CreateNewOrder
          setCreateOrderModal={setCreateOrderModal}
          createNewOrderLoading={createNewOrderLoading}
          setCreateNewOrderLoading={setCreateNewOrderLoading}
        />
      </Modal>
    </div>
  );

  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={mainContent}
      searchInputText={searchInputText}
      setSearchInputText={setSearchInputText}
      onClickSearchButton={() => {}}
      searchInputMaxLetters={50}
    />
  );
}

export default Orders;

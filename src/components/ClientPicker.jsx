import { useState, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import debounce from "lodash.debounce";
import Modal from "./Modal";
import CreateNewClient from "./CreateNewClient";
import { searchClientKZ } from "../api/ClientApi";
import AsyncSelect from "./AsyncSelect";
import styled from "styled-components";
import { FaPlusCircle } from "react-icons/fa";
import ClientInfo from "./ClientInfo";

const AddClientButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ClientPicker({
  disabled,
  selectedClientInfo,
  setSelectedClientInfo,
  selectedClient,
  setSelectedClient,
}) {
  const [createNewClientModal, setCreateNewClientModal] = useState(false);
  const [createNewClientLoading, setCreateNewClientLoading] = useState(false);
  const [searchClientLoading, setSearchClientLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const { token } = useAuth();

  const debouncedSearchClientKZ = debounce((searchText) => {
    if (!searchText) {
      setClients([]);
      return;
    }
    searchClientKZ(setSearchClientLoading, token, searchText, setClients);
  }, 300);

  const formattedClients = useMemo(() => {
    const result = clients.map((item) => ({
      id: item.id,
      value: `${item?.second_name} ${item?.name} ${
        item?.father_name ? item?.father_name : ""
      } (${item.paper_person_id})`,
    }));
    return result;
  }, [clients]);

  return (
    <div>
      <AsyncSelect
        disabled={disabled}
        loading={searchClientLoading}
        onClickButton={() => setCreateNewClientModal(true)}
        selectedOption={selectedClient}
        setSelectedOption={setSelectedClient}
        onChangeText={debouncedSearchClientKZ}
        options={formattedClients}
        placeholder="Поиск клиента..."
        buttonText={
          <AddClientButton>
            <FaPlusCircle size={20} />
            <p>Новый клиент</p>
          </AddClientButton>
        }
      />
      <ClientInfo
        selectedClientInfo={selectedClientInfo}
        setSelectedClientInfo={setSelectedClientInfo}
        selectedClient={selectedClient}
      />
      <Modal
        onlyByClose={true}
        title="Создание нового клиента"
        modalVisible={createNewClientModal}
        setModalVisible={setCreateNewClientModal}
        noEscape={createNewClientLoading}
      >
        <CreateNewClient
          next={() => setCreateNewClientModal(false)}
          createNewClientLoading={createNewClientLoading}
          setCreateNewClientLoading={setCreateNewClientLoading}
        />
      </Modal>
    </div>
  );
}

export default ClientPicker;

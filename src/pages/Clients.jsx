import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import ContainerLayout from "../components/ContainerLayout";
import { FaPlusSquare } from "react-icons/fa";
import cl from "../styles/Goods.module.css";
import CredButtons from "../components/CredButtons";
import ControlPanelButtons from "../components/ControlPanelButtons";
import Modal from "../components/Modal";
import CreateNewClient from "../components/CreateNewClient";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Select from "../components/Select";
import { BsFilterSquareFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import TableLayout from "../components/TableLayout";
import { getAllClients } from "../api/ClientApi";
import { BiPencil } from "react-icons/bi";
import styled from "styled-components";
import EditClientForm from "../components/EditClientForm";

const OtherWrapper = styled.div`
  display: block;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.disabled && "gray"};
`;

function Clients() {
  const [clientsLoading, setClientsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [createClientModal, setCreateClientModal] = useState(false);
  const [filterSortModal, setFilterSortModal] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [editModalUserId, setEditModalUserId] = useState(0);
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("clientsPageSize")
      ? parseInt(localStorage.getItem("clientsPageSize"))
      : 10
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortClientsBy")
      ? localStorage.getItem("sortClientsBy")
      : "create_date"
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("clientsSortOrder")
      ? localStorage.getItem("clientsSortOrder")
      : "ASC"
  );
  const { token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const credButtons = [
    {
      id: 0,
      title: "Новый клиент",
      icon: <FaPlusSquare color="#0F9D58" size={20} />,
      onClick: () => setCreateClientModal(true),
    },
  ];

  const controlPanelButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Фильтры и сортировка",
        icon: <BsFilterSquareFill size={20} />,
        onClick: () => {
          setFilterSortModal(true);
        },
      },
    ],
    []
  );

  const pageSizes = useMemo(
    () => [
      { id: 10, name: 10 },
      { id: 12, name: 12 },
      { id: 24, name: 24 },
      { id: 36, name: 36 },
      { id: 50, name: 50 },
    ],
    []
  );

  const sortByOptions = useMemo(
    () => [{ id: "create_date", name: "По дате создания" }],
    []
  );

  const sortOrderOptions = useMemo(
    () => [
      { id: "DESC", name: "По убыванию" },
      { id: "ASC", name: "По возрастанию" },
    ],
    []
  );

  const fetchData = useCallback(() => {
    const params = {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };
    if (confirmedSearchText) {
      params.filter = confirmedSearchText;
    }
    getAllClients(
      setClientsLoading,
      token,
      setClients,
      params,
      setFilteredTotalCount
    );
  }, [token, page, pageSize, confirmedSearchText, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchInputText === "") {
      setConfirmedSearchText("");
    }
  }, [searchInputText]);

  useEffect(() => {
    setPage(1);
  }, [confirmedSearchText, pageSize]);

  useEffect(() => {
    navigate(`/clients/${page}`);
  }, [page, navigate]);

  useEffect(() => {
    setPage(parseInt(params.page));
  }, [params.page]);

  const headers = useMemo(
    () => [
      {
        id: "index",
        style: {
          fixedMinWidth: "50px",
          fixedJustWidth: "50px",
          fixedMaxWidth: "50px",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "id",
        style: {
          fixedMinWidth: "50px",
          fixedJustWidth: "50px",
          fixedMaxWidth: "50px",
        },
        title: "ID",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "fullname",
        style: {
          fixedMinWidth: "150px",
          fixedJustWidth: "150px",
          fixedMaxWidth: "150px",
        },
        title: "ФИО",
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
      {
        id: "paper_person_id",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "ИИН",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "editUserButton",
        style: {
          fixedMinWidth: "90px",
          fixedJustWidth: "90px",
          fixedMaxWidth: "90px",
        },
        dataStyle: { dataAlign: "center", cursorType: "pointer" },
        title: "РЕДАКТИРОВАТЬ",
        type: "other",
        children: ({ dataItem }) => {
          return (
            <OtherWrapper
              disabled={editLoading}
              onClick={() => {
                if (!editLoading && editModalUserId !== dataItem.id) {
                  setEditModalUserId(dataItem.id);
                }
              }}
            >
              <BiPencil size={25} color="#2786f2" />
              <Modal
                modalVisible={editModalUserId === dataItem.id}
                setModalVisible={(v) => {
                  if (v) {
                    setEditModalUserId(dataItem.id);
                  } else {
                    setEditModalUserId();
                  }
                }}
                noEscape={editLoading}
                title="Редактирование клиента"
              >
                <EditClientForm
                  isLoading={editLoading}
                  setIsLoading={setEditLoading}
                  clientId={dataItem.id}
                  next={() => {
                    setEditModalUserId();
                    fetchData();
                  }}
                />
              </Modal>
            </OtherWrapper>
          );
        },
      },
    ],
    [editLoading, editModalUserId, fetchData]
  );
  const dataForTable = useMemo(
    () =>
      clients.map((item, index) => ({
        id: item.id,
        index: index + 1 + (page - 1) * pageSize,
        cellphone: item.cellphone,
        paper_person_id: item.paper_person_id,
        fullname: `${item.second_name} ${item.name} ${
          item?.father_name ? item.father_name : ""
        }`,
      })),
    [clients, page, pageSize]
  );

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
    </div>
  );

  const mainContent = (
    <div className={cl.MainContent}>
      <div className={cl.SortFilterPanel}>
        <div className={cl.Sorts}>
          <div className={cl.TotalInfo}>
            {confirmedSearchText ? (
              <p>{`Результаты по запросу: "${confirmedSearchText}"`}</p>
            ) : (
              <p>{`Пустой запрос`}</p>
            )}
            <p>{`Найдено результатов: ${filteredTotalCount}`}</p>
          </div>
          <ControlPanelButtons controlPanelButtons={controlPanelButtons} />
        </div>
        <Pagination
          loading={clientsLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </div>
      {clientsLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : (
        <TableLayout headers={headers} data={dataForTable} />
      )}
      <Modal
        onlyByClose={true}
        title="Создание нового клиента"
        modalVisible={createClientModal}
        setModalVisible={setCreateClientModal}
        noEscape={editLoading}
      >
        <CreateNewClient
          setIsLoading={setEditLoading}
          isLoading={editLoading}
          next={() => {
            setCreateClientModal(false);
            fetchData();
          }}
        />
      </Modal>
      <Modal
        title="Фильтры и сортировка"
        modalVisible={filterSortModal}
        setModalVisible={setFilterSortModal}
      >
        <Select
          defaultOptions={[]}
          value={pageSize}
          label="Элементов на странице"
          options={pageSizes}
          loading={clientsLoading}
          setValue={(v) => {
            setPageSize(v);
            localStorage.setItem("clientsPageSize", String(v));
          }}
        />
        <Select
          defaultOptions={[]}
          value={sortBy}
          label="Сортировать по"
          options={sortByOptions}
          loading={clientsLoading}
          setValue={(v) => {
            setSortBy(v);
            localStorage.setItem("sortClientsBy", String(v));
          }}
        />
        <Select
          defaultOptions={[]}
          value={sortOrder}
          label="Порядок сортировки"
          options={sortOrderOptions}
          loading={clientsLoading}
          setValue={(v) => {
            setSortOrder(v);
            localStorage.setItem("clientsSortOrder", String(v));
          }}
        />
      </Modal>
    </div>
  );

  return (
    <ContainerLayout
      searchInputText={searchInputText}
      setSearchInputText={setSearchInputText}
      leftContent={leftContent}
      mainContent={mainContent}
      onClickSearchButton={() => setConfirmedSearchText(searchInputText)}
      searchButtonLoading={clientsLoading}
      searchInputMaxLetters={50}
    />
  );
}

export default Clients;

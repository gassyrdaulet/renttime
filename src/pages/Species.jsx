import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import { getAllSpecies, getSpeciesXLSX } from "../api/GoodsApi";
import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import ControlPanelButtons from "../components/ControlPanelButtons";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Select from "../components/Select";
import { BsFilterSquareFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import TableLayout from "../components/TableLayout";
import styled from "styled-components";
import config from "../config/config.json";
import moment from "moment";
import Groups from "../components/Groups";
import { FaListAlt } from "react-icons/fa";
import InfoRows from "../components/InfoRows";

const { SPECIE_STATUSES, CURRENCIES } = config;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
`;
const SortFilterPanel = styled.div`
  margin-bottom: 20px;
`;
const Sorts = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(212, 212, 212);
  padding-bottom: 5px;
  margin-bottom: 15px;
`;
const TotalInfo = styled.div`
  display: block;
  & p {
    font-size: 10px;
    user-select: none;
    color: rgb(44, 44, 44);
  }
`;
const FilterSortModalWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const FilterSortModalContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const FilterSortModalInputsContainer = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;
const FilterSortModalInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  width: 100%;
  @media (max-width: 800px) {
    max-width: 300px;
  }
`;

function Species() {
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [species, setSpecies] = useState([]);
  const [filterSortModal, setFilterSortModal] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("speciesSortOrder")
      ? localStorage.getItem("speciesSortOrder")
      : "DESC"
  );
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("speciesPageSize")
      ? parseInt(localStorage.getItem("speciesPageSize"))
      : 10
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortSpeciesBy")
      ? localStorage.getItem("sortSpeciesBy")
      : "id"
  );
  const { token, currency } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const totalInfo = useMemo(
    () => [
      {
        type: "partTitle",
        value: "Общая сумма оборудования",
      },
      {
        type: "rowValue",
        value: `${totalSum} ${CURRENCIES[currency]}`,
      },
    ],
    [totalSum, currency]
  );

  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Скачать список XLSX",
        icon: <FaListAlt color="green" size={20} />,
        onClick: () => {
          getSpeciesXLSX(setXlsxLoading, token);
        },
        disabled: xlsxLoading,
      },
    ],
    [token, xlsxLoading]
  );

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
    () => [
      { id: "id", name: "По ID" },
      { id: "good", name: "По карточкам" },
      { id: "status", name: "По статусу" },
    ],
    []
  );

  const sortOrderOptions = useMemo(
    () => [
      { id: "DESC", name: "По убыванию" },
      { id: "ASC", name: "По возрастанию" },
    ],
    []
  );

  const groups = useMemo(
    () => [
      { id: "all", name: `Все ${totalCount ? `(${totalCount})` : ""}` },
      ...Object.keys(SPECIE_STATUSES).map((key) => ({
        id: key,
        name: SPECIE_STATUSES[key],
      })),
    ],
    [totalCount]
  );

  const fetchData = useCallback(() => {
    const selectParams = {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };
    if (selectParams.page !== parseInt(params.page)) {
      return;
    }
    if (confirmedSearchText) {
      selectParams.filter = confirmedSearchText;
    }
    if (selectedGroup !== "all") {
      selectParams.status = selectedGroup;
    }
    getAllSpecies(
      setSpeciesLoading,
      token,
      setSpecies,
      selectParams,
      setTotalCount,
      setFilteredTotalCount,
      setTotalSum
    );
  }, [
    selectedGroup,
    token,
    page,
    pageSize,
    confirmedSearchText,
    params.page,
    sortOrder,
    sortBy,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!searchInputText) {
      setConfirmedSearchText("");
    }
  }, [searchInputText]);

  useEffect(() => {
    setPage(1);
  }, [confirmedSearchText, pageSize]);

  useEffect(() => {
    navigate(`/goods/species/${selectedGroup}/${page}`);
  }, [page, selectedGroup, navigate]);

  useEffect(() => {
    setPage(parseInt(params.page));
    setSelectedGroup(params.group);
  }, [params.page, params.group]);

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
        id: "code",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        title: "ИНВ. НОМЕР",
        type: "text",
      },
      {
        id: "goodName",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "НАИМЕНОВАНИЕ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "status",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "СТАТУС",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "order",
        style: {
          fixedMinWidth: "50px",
          fixedJustWidth: "50px",
          fixedMaxWidth: "50px",
        },
        title: "ЗАКАЗ",
        type: "text",
        dataStyle: { dataAlign: "center" },
      },
      {
        id: "created_date",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "80px",
          fixedMaxWidth: "80px",
        },
        title: "ДАТА СОЗДАНИЯ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
    ],
    []
  );
  const dataForTable = useMemo(
    () =>
      species.map((item, index) => ({
        id: item.id,
        index: index + 1 + (page - 1) * pageSize,
        code: `${item.good}/${item.id}`,
        status: SPECIE_STATUSES[item.status]?.toUpperCase(),
        order: item.order,
        goodName: `${item.goodInfo.name} (ID: ${item.goodInfo.id})`,
        created_date: moment(item.created_date).format("DD.MM.YYYY HH:mm"),
      })),
    [species, page, pageSize]
  );

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
      <InfoRows infoRows={totalInfo} margin="0 0 20px 0" />
      <Groups
        defaultOptions={groups}
        switchLoading={speciesLoading}
        setSelectedGroup={setSelectedGroup}
        selectedGroup={selectedGroup}
        groupsLoading={false}
        groups={[]}
        next={() => {
          fetchData();
        }}
      />
    </div>
  );

  const mainContent = (
    <MainContent>
      <SortFilterPanel>
        <Sorts>
          <TotalInfo>
            {confirmedSearchText ? (
              <p>{`Результаты по запросу: "${confirmedSearchText}"`}</p>
            ) : (
              <p>{`Пустой запрос`}</p>
            )}
            <p>{`Найдено результатов: ${filteredTotalCount}`}</p>
          </TotalInfo>
          <ControlPanelButtons controlPanelButtons={controlPanelButtons} />
        </Sorts>
        <Pagination
          loading={speciesLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </SortFilterPanel>
      {speciesLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : (
        <TableLayout headers={headers} data={dataForTable} marking={false} />
      )}
      <Modal
        title="Фильтры и сортировка"
        modalVisible={filterSortModal}
        setModalVisible={setFilterSortModal}
      >
        <FilterSortModalWrapper>
          <FilterSortModalContainer>
            <FilterSortModalInputsContainer>
              <FilterSortModalInputContainer>
                <Select
                  defaultOptions={[]}
                  value={pageSize}
                  label="Элементов на странице"
                  options={pageSizes}
                  loading={speciesLoading}
                  setValue={(v) => {
                    setPageSize(v);
                    localStorage.setItem("speciesPageSize", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortBy}
                  label="Сортировать по"
                  options={sortByOptions}
                  loading={speciesLoading}
                  setValue={(v) => {
                    setSortBy(v);
                    localStorage.setItem("sortSpeciesBy", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortOrder}
                  label="Порядок сортировки"
                  options={sortOrderOptions}
                  loading={speciesLoading}
                  setValue={(v) => {
                    setSortOrder(v);
                    localStorage.setItem("speciesSortOrder", String(v));
                  }}
                />
              </FilterSortModalInputContainer>
            </FilterSortModalInputsContainer>
          </FilterSortModalContainer>
        </FilterSortModalWrapper>
      </Modal>
    </MainContent>
  );

  return (
    <ContainerLayout
      searchInputText={searchInputText}
      setSearchInputText={setSearchInputText}
      leftContent={leftContent}
      mainContent={mainContent}
      onClickSearchButton={() => setConfirmedSearchText(searchInputText)}
      searchButtonLoading={speciesLoading}
      searchInputMaxLetters={50}
    />
  );
}

export default Species;

import { useState, useMemo, useEffect, useCallback } from "react";
import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import Modal from "../components/Modal";
import { FaPlusSquare } from "react-icons/fa";
import CreateNewOrder from "../components/CreateNewOrder";
import { getAllOrders } from "../api/OrderApi";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";
import ControlPanelButtons from "../components/ControlPanelButtons";
import { BsFilterSquareFill } from "react-icons/bs";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import Order from "../components/Order";
import Select from "../components/Select";
import { useNavigate, useParams } from "react-router-dom";
import Groups from "../components/Groups";
import DatePicker from "../components/DatePicker";
import Switch from "../components/Switch";
import moment from "moment";

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
const OrdersList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 160px);
  justify-content: space-between;
  row-gap: 30px;
  column-gap: 10px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 160px);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 138px);
    row-gap: 15px;
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

function Orders() {
  const params = useParams();
  const [createOrderModal, setCreateOrderModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(parseInt(params.group));
  const [createNewOrderLoading, setCreateNewOrderLoading] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [page, setPage] = useState(1);
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortOrdersBy")
      ? localStorage.getItem("sortOrdersBy")
      : "id"
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("ordersSortOrder")
      ? localStorage.getItem("ordersSortOrder")
      : "DESC"
  );
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("ordersPageSize")
      ? localStorage.getItem("ordersPageSize")
      : 10
  );
  const [dateRange, setDateRange] = useState(false);
  const [firstDate, setFirstDate] = useState(
    moment().subtract(1, "day").startOf("day")
  );
  const [secondDate, setSecondDate] = useState(moment().endOf("day"));
  const [dateType, setDateType] = useState(
    localStorage.getItem("ordersDateType")
      ? localStorage.getItem("ordersDateType")
      : "created_date"
  );
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterSortModal, setFilterSortModal] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getAllOrdersCallback = useCallback(() => {
    const selectParams = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      archive: selectedGroup === 1,
    };
    if (confirmedSearchText) {
      selectParams.filter = confirmedSearchText;
    }
    if (selectedGroup === 1 && !dateRange) {
      return;
    }
    if (selectParams.page !== parseInt(params.page)) {
      return;
    }
    if (dateRange) {
      selectParams.dateType = dateType;
      selectParams.firstDate = moment(firstDate).toDate();
      selectParams.secondDate = moment(secondDate).toDate();
    }
    getAllOrders(
      setOrdersLoading,
      token,
      setOrders,
      selectParams,
      setFilteredTotalCount,
      setTotalCount
    );
  }, [
    page,
    token,
    params.page,
    pageSize,
    confirmedSearchText,
    sortBy,
    sortOrder,
    selectedGroup,
    dateRange,
    dateType,
    firstDate,
    secondDate,
  ]);

  useEffect(() => {
    navigate(`/orders/${selectedGroup}/${page}`);
  }, [page, selectedGroup, navigate]);

  useEffect(() => {
    setPage(parseInt(params.page));
    setSelectedGroup(parseInt(params.group));
  }, [params.page, params.group]);

  useEffect(() => {
    getAllOrdersCallback();
  }, [getAllOrdersCallback]);

  useEffect(() => {
    if (selectedGroup === 1) {
      setDateRange(true);
    } else {
      setDateRange(false);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (!searchInputText) {
      setConfirmedSearchText("");
    }
  }, [searchInputText]);

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
      { id: "created_date", name: "По дате создания" },
      { id: "started_date", name: "По дате старта" },
      { id: "planned_date", name: "По дате плана" },
      { id: "finished_date", name: "По дате заврешения" },
    ],
    []
  );
  const dateTypeOptions = useMemo(
    () => [
      { id: "created_date", name: "По дате создания" },
      { id: "started_date", name: "По дате старта" },
      { id: "finished_date", name: "По дате заврешения" },
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

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
      <Groups
        defaultOptions={[
          { id: 0, name: `Текущие заказы (${totalCount})` },
          { id: 1, name: "Архив" },
        ]}
        switchLoading={ordersLoading}
        setSelectedGroup={setSelectedGroup}
        selectedGroup={selectedGroup}
        groupsLoading={false}
        onGroupChange={() => setPage(1)}
        groups={[]}
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
            {dateRange && (
              <p>{`Дата: ${moment(firstDate).format("DD.MM.YYYY")} - ${moment(
                secondDate
              ).format("DD.MM.YYYY")}`}</p>
            )}
            <p>{`Найдено результатов: ${filteredTotalCount}`}</p>
          </TotalInfo>
          <ControlPanelButtons controlPanelButtons={controlPanelButtons} />
        </Sorts>
        <Pagination
          loading={ordersLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </SortFilterPanel>
      {ordersLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : orders.length === 0 ? (
        <div className="LoadingWrapper2">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <OrdersList>
          {orders.map((item, index) => (
            <Order
              index={index + 1 + pageSize * (page - 1)}
              onClick={() => {
                navigate(`/orders/${selectedGroup}/${page}/${item.id}`);
              }}
              key={item.id}
              orderItem={item}
            />
          ))}
        </OrdersList>
      )}
      <Modal
        modalVisible={createOrderModal}
        setModalVisible={setCreateOrderModal}
        title="Создание нового заказа"
        onlyByClose={true}
        noEscape={createNewOrderLoading}
      >
        <CreateNewOrder
          createNewOrderLoading={createNewOrderLoading}
          setCreateNewOrderLoading={setCreateNewOrderLoading}
          next={() => {
            setCreateOrderModal(false);
            getAllOrdersCallback();
          }}
        />
      </Modal>
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
                  loading={ordersLoading}
                  setValue={(v) => {
                    setPageSize(v);
                    localStorage.setItem("ordersPageSize", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortBy}
                  label="Сортировать по"
                  options={sortByOptions}
                  loading={ordersLoading}
                  setValue={(v) => {
                    setSortBy(v);
                    localStorage.setItem("sortOrdersBy", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortOrder}
                  label="Порядок сортировки"
                  options={sortOrderOptions}
                  loading={ordersLoading}
                  setValue={(v) => {
                    setSortOrder(v);
                    localStorage.setItem("ordersSortOrder", String(v));
                  }}
                />
                <Switch
                  label="Выбрать отрезок времени"
                  isChecked={dateRange}
                  setChecked={setDateRange}
                  disabled={selectedGroup === 1 || ordersLoading}
                />
              </FilterSortModalInputContainer>
              {dateRange && (
                <FilterSortModalInputContainer>
                  <Select
                    defaultOptions={[]}
                    value={dateType}
                    label="Тип даты"
                    options={dateTypeOptions}
                    loading={ordersLoading}
                    setValue={(v) => {
                      setDateType(v);
                      localStorage.setItem("ordersDateType", String(v));
                    }}
                  />
                  <DatePicker
                    disabled={ordersLoading}
                    label="Дата от"
                    timeFormat={false}
                    selectedDate={firstDate}
                    handleDateChange={setFirstDate}
                    dateTimeInputFormat="DD.MM.YYYY HH:mm:ss"
                  />
                  <DatePicker
                    disabled={ordersLoading}
                    label="Дата до"
                    timeFormat={false}
                    selectedDate={secondDate}
                    handleDateChange={setSecondDate}
                    dateTimeInputFormat="DD.MM.YYYY HH:mm:ss"
                  />
                </FilterSortModalInputContainer>
              )}
            </FilterSortModalInputsContainer>
          </FilterSortModalContainer>
        </FilterSortModalWrapper>
      </Modal>
    </MainContent>
  );

  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={mainContent}
      searchInputText={searchInputText}
      setSearchInputText={setSearchInputText}
      searchInputMaxLetters={50}
      onClickSearchButton={() => setConfirmedSearchText(searchInputText)}
    />
  );
}

export default Orders;

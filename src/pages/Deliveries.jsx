import { useState, useMemo, useEffect, useCallback } from "react";
import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";
import ControlPanelButtons from "../components/ControlPanelButtons";
import { BsFilterSquareFill } from "react-icons/bs";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import Select from "../components/Select";
import { useNavigate, useParams } from "react-router-dom";
import Groups from "../components/Groups";
import DatePicker from "../components/DatePicker";
import Switch from "../components/Switch";
import moment from "moment";
import { getDeliveries } from "../api/DeliveriesApi";
import TableLayout from "../components/TableLayout";
import config from "../config/config.json";
import { BiCheckCircle, BiPaperPlane } from "react-icons/bi";
import SendCourierForm from "../components/SendCourierForm";
import PayOffForm from "../components/PayoffForm";
import { getCouriers } from "../api/OrganizationApi";

const { DELIVERY_DIRECTIONS, DELIVERY_STATUSES } = config;

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

function Deliveries() {
  const params = useParams();
  const [selectedGroup, setSelectedGroup] = useState(params.group);
  const [searchInputText, setSearchInputText] = useState("");
  const [page, setPage] = useState(1);
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortDeliveriesBy")
      ? localStorage.getItem("sortDeliveriesBy")
      : "id"
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("deliveriesSortOrder")
      ? localStorage.getItem("deliveriesSortOrder")
      : "DESC"
  );
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("deliveriesPageSize")
      ? localStorage.getItem("deliveriesPageSize")
      : 10
  );
  const [dateRange, setDateRange] = useState(false);
  const [firstDate, setFirstDate] = useState(
    moment().subtract(1, "day").startOf("day")
  );
  const [secondDate, setSecondDate] = useState(moment().endOf("day"));
  const [dateType, setDateType] = useState(
    localStorage.getItem("deliveriesDateType")
      ? localStorage.getItem("deliveriesDateType")
      : "created_date"
  );
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [totalCount, setTotalCount] = useState({});
  const [marked, setMarked] = useState({});
  const [filterSortModal, setFilterSortModal] = useState(false);
  const [sendCourierModal, setSendCourierModal] = useState(false);
  const [payoffModal, setPayoffModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [courierId, setCourierId] = useState(0);
  const [couriers, setCouriers] = useState([]);
  const [couriersLoading, setCouriersLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getDeliveriesCallback = useCallback(() => {
    setMarked({});
    const params = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      status: selectedGroup,
      archive: selectedGroup === "archive",
    };
    if (confirmedSearchText) {
      params.filter = confirmedSearchText;
    }
    if (selectedGroup === "archive" && !dateRange) {
      return;
    }
    if (dateRange) {
      params.dateType = dateType;
      params.firstDate = moment(firstDate).toDate();
      params.secondDate = moment(secondDate).toDate();
    }
    if (courierId) {
      params.courier_id = courierId;
    }
    getDeliveries(
      setDeliveriesLoading,
      token,
      setDeliveries,
      params,
      setFilteredTotalCount,
      setTotalCount
    );
  }, [
    page,
    token,
    pageSize,
    confirmedSearchText,
    sortBy,
    sortOrder,
    selectedGroup,
    dateRange,
    dateType,
    firstDate,
    secondDate,
    courierId,
  ]);

  useEffect(() => {
    getCouriers(setCouriersLoading, token, setCouriers);
  }, [token]);
  useEffect(() => {
    navigate(`/deliveries/${selectedGroup}/${page}`);
  }, [page, selectedGroup, navigate]);
  useEffect(() => {
    setPage(parseInt(params.page));
    setSelectedGroup(params.group);
  }, [params.page, params.group]);
  useEffect(() => {
    getDeliveriesCallback();
  }, [getDeliveriesCallback]);
  useEffect(() => {
    if (selectedGroup === "archive") {
      setDateRange(true);
    }
  }, [selectedGroup]);

  const markedDeliveries = useMemo(() => {
    const result = [];
    deliveries.forEach((delivery) => {
      if (marked[delivery.id]) result.push(delivery);
    });
    return result;
  }, [marked, deliveries]);
  const isSameCourier = useMemo(() => {
    const couriers = [];
    for (let delivery of markedDeliveries) {
      if (!delivery.courier_id) {
        continue;
      }
      for (let courier of couriers) {
        if (courier === delivery.courier_id) {
          continue;
        }
      }
      couriers.push(delivery.courier_id);
      if (couriers.length > 1) {
        return false;
      }
    }
    return true;
  }, [markedDeliveries]);
  const courierOptions = useMemo(() => {
    const result = couriers.map((item) => ({
      id: item.userInfo?.id,
      name: `${item.userInfo?.name} (ID: ${item.userInfo?.id})`,
    }));
    return result;
  }, [couriers]);
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
        title: "Отправить",
        icon: <BiPaperPlane color="#0F589D" size={20} />,
        onClick: () => setSendCourierModal(true),
        disabled: Object.keys(marked).length === 0,
      },
      {
        id: 1,
        title: "Подтвердить",
        icon: <BiCheckCircle color="#0F9D58" size={20} />,
        onClick: () => setPayoffModal(true),
        disabled:
          Object.keys(marked).length === 0 ||
          !isSameCourier ||
          selectedGroup !== "processing",
      },
    ],
    [marked, isSameCourier, selectedGroup]
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
      { id: "went_date", name: "По дате отправления" },
      { id: "delivered_date", name: "По дате поступления в обработку" },
      { id: "finished_date", name: "По дате расчета" },
    ],
    []
  );
  const dateTypeOptions = useMemo(
    () => [
      { id: "created_date", name: "По дате создания" },
      { id: "went_date", name: "По дате отправления" },
      { id: "delivered_date", name: "По дате поступления в обработку" },
      { id: "finished_date", name: "По дате расчета" },
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
  const headers = useMemo(
    () => [
      {
        id: "index",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "60px",
          fixedMaxWidth: "5%",
        },
        title: "№",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "id",
        style: {
          fixedMinWidth: "80px",
          fixedJustWidth: "60px",
          fixedMaxWidth: "5%",
        },
        title: "ID",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "address",
        style: {
          fixedMinWidth: "150px",
          fixedJustWidth: "60px",
          fixedMaxWidth: "200px",
        },
        title: "АДРЕС",
        type: "text",
      },
      {
        id: "direction",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "160px",
          fixedMaxWidth: "200px",
        },
        title: "НАПРАВЛЕНИЕ",
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
        id: "delivery_price_for_deliver",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "160px",
          fixedMaxWidth: "200px",
        },
        title: "ПЛАТА ЗА ДОСТАВКУ",
        type: "text",
        dataStyle: { dataAlign: "center" },
      },
      {
        id: "comment",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "160px",
          fixedMaxWidth: "200px",
        },
        title: "КОММЕНТАРИЙ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "courier",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "160px",
          fixedMaxWidth: "200px",
        },
        title: "КУРЬЕР",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "created_date",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "160px",
          fixedMaxWidth: "200px",
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
      deliveries.map((item, index) => ({
        id: item.id,
        index: index + 1 + (page - 1) * pageSize,
        address: item.address,
        comment: item.comment,
        status: item.cancelled
          ? "ОТМЕНЕН"
          : DELIVERY_STATUSES[item.status]?.toUpperCase(),
        courier: item.courier?.name,
        created_date: moment(item.created_date).format("DD.MM.YYYY HH:mm"),
        delivery_price_for_deliver: item.delivery_price_for_deliver,
        direction: DELIVERY_DIRECTIONS[item.direction].toUpperCase(),
      })),
    [deliveries, page, pageSize]
  );

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
      <Groups
        defaultOptions={[
          {
            id: "new",
            name: `Новые ${totalCount.new ? `(${totalCount.new})` : ""}`,
          },
          {
            id: "wfd",
            name: `На доставке ${totalCount.wfd ? `(${totalCount.wfd})` : ""}`,
          },
          {
            id: "processing",
            name: `На обработке ${
              totalCount.processing ? `(${totalCount.processing})` : ""
            }`,
          },
          { id: "archive", name: "Архив" },
        ]}
        switchLoading={deliveriesLoading}
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
            <p>{`Отмечено: ${Object.keys(marked).length}`}</p>
          </TotalInfo>
          <ControlPanelButtons controlPanelButtons={controlPanelButtons} />
        </Sorts>
        <Pagination
          loading={deliveriesLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </SortFilterPanel>
      {deliveriesLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : deliveries.length === 0 ? (
        <div className="LoadingWrapper2">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <TableLayout
          marking={true}
          marked={marked}
          setMarked={setMarked}
          headers={headers}
          data={dataForTable}
          onClickRow={(item) =>
            navigate(`/deliveries/${params.group}/${page}/${item.id}`)
          }
        />
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
                  label="Выберите курьера"
                  value={courierId}
                  setValue={setCourierId}
                  loading={deliveriesLoading || couriersLoading}
                  defaultOptions={[{ id: 0, name: "Не выбран" }]}
                  options={courierOptions}
                />
                <Select
                  defaultOptions={[]}
                  value={pageSize}
                  label="Элементов на странице"
                  options={pageSizes}
                  loading={deliveriesLoading}
                  setValue={(v) => {
                    setPageSize(v);
                    localStorage.setItem("deliveriesPageSize", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortBy}
                  label="Сортировать по"
                  options={sortByOptions}
                  loading={deliveriesLoading}
                  setValue={(v) => {
                    setSortBy(v);
                    localStorage.setItem("sortDeliveriesBy", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortOrder}
                  label="Порядок сортировки"
                  options={sortOrderOptions}
                  loading={deliveriesLoading}
                  setValue={(v) => {
                    setSortOrder(v);
                    localStorage.setItem("deliveriesSortOrder", String(v));
                  }}
                />
                <Switch
                  label="Выбрать отрезок времени"
                  isChecked={dateRange}
                  setChecked={setDateRange}
                  disabled={selectedGroup === 1 || deliveriesLoading}
                />
              </FilterSortModalInputContainer>
              {dateRange && (
                <FilterSortModalInputContainer>
                  <Select
                    defaultOptions={[]}
                    value={dateType}
                    label="Тип даты"
                    options={dateTypeOptions}
                    loading={deliveriesLoading}
                    setValue={(v) => {
                      setDateType(v);
                      localStorage.setItem("deliveriesDateType", String(v));
                    }}
                  />
                  <DatePicker
                    disabled={deliveriesLoading}
                    label="Дата от"
                    timeFormat={false}
                    selectedDate={firstDate}
                    handleDateChange={setFirstDate}
                    dateTimeInputFormat="DD.MM.YYYY HH:mm:ss"
                  />
                  <DatePicker
                    disabled={deliveriesLoading}
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
      <Modal
        title="Отправить доставки"
        setModalVisible={setSendCourierModal}
        modalVisible={sendCourierModal}
        noEscape={deliveriesLoading || operationLoading}
        onlyByClose={true}
      >
        <SendCourierForm
          isLoading={operationLoading}
          setIsLoading={setOperationLoading}
          deliveries={Object.keys(marked).map((item) => ({
            delivery_id: parseInt(item),
          }))}
          next={() => {
            setSendCourierModal(false);
            getDeliveriesCallback();
          }}
        />
      </Modal>
      <Modal
        title={`Расчет с курьером ${markedDeliveries[0]?.courier?.name}`}
        setModalVisible={setPayoffModal}
        modalVisible={payoffModal}
        noEscape={deliveriesLoading || operationLoading}
        onlyByClose={true}
      >
        <PayOffForm
          isLoading={operationLoading}
          setIsLoading={setOperationLoading}
          deliveries={markedDeliveries}
          setModal={setPayoffModal}
          next={() => {
            setPayoffModal(false);
            getDeliveriesCallback();
          }}
        />
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

export default Deliveries;

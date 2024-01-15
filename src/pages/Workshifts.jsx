import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import ContainerLayout from "../components/ContainerLayout";
import { FaLock, FaLockOpen, FaRegEdit } from "react-icons/fa";
import CredButtons from "../components/CredButtons";
import ControlPanelButtons from "../components/ControlPanelButtons";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Select from "../components/Select";
import { BsFilterSquareFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import TableLayout from "../components/TableLayout";
import config from "../config/config.json";
import {
  closeWorkshift,
  getAllWorkshifts,
  getWorkshift,
  openWorkshift,
} from "../api/OrganizationApi";
import DatePicker from "../components/DatePicker";
import moment from "moment";
import useConfirm from "../hooks/useConfirm";
import CreateOperationForm from "../components/CreateOperationForm";
import styled from "styled-components";
import InfoRows from "../components/InfoRows";
import { BiZoomIn } from "react-icons/bi";

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

const { CURRENCIES } = config;

function Workshifts() {
  const [workshiftsLoading, setWorkshiftsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [workshifts, setWorkshifts] = useState([]);
  const [createOperationModal, setCreateOperationModal] = useState(false);
  const [filterSortModal, setFilterSortModal] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [activeWorkshift, setActiveWorkshift] = useState();
  const [activeWorkshiftLoading, setActiveWorkshiftLoading] = useState(false);
  const [confirmedSearchText, setConfirmedSearchText] = useState("");
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("workshiftsPageSize")
      ? parseInt(localStorage.getItem("workshiftsPageSize"))
      : 10
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortWorkshiftsBy")
      ? localStorage.getItem("sortWorkshiftsBy")
      : "open_date"
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("workshiftsSortOrder")
      ? localStorage.getItem("workshiftsSortOrder")
      : "ASC"
  );
  const [dateType, setDateType] = useState(
    localStorage.getItem("workshiftsDateType")
      ? localStorage.getItem("workshiftsDateType")
      : "open_date"
  );
  const { token, currency } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [firstDate, setFirstDate] = useState(
    moment().subtract(1, "month").startOf("day")
  );
  const [secondDate, setSecondDate] = useState(moment().endOf("day"));
  const { confirm } = useConfirm();

  const fetchData = useCallback(() => {
    const selectParams = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      firstDate: moment(firstDate).toDate(),
      secondDate: moment(secondDate).toDate(),
      dateType,
    };
    if (confirmedSearchText) {
      selectParams.filter = confirmedSearchText;
    }
    if (selectParams.page !== parseInt(params.page)) {
      return;
    }
    getAllWorkshifts(
      setWorkshiftsLoading,
      token,
      setWorkshifts,
      selectParams,
      setFilteredTotalCount
    );
    getWorkshift(setActiveWorkshiftLoading, {}, token, setActiveWorkshift);
  }, [
    token,
    params.page,
    page,
    pageSize,
    confirmedSearchText,
    sortBy,
    sortOrder,
    firstDate,
    secondDate,
    dateType,
  ]);

  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Новая смена",
        icon: <FaLockOpen color="#0F9D58" size={20} />,
        onClick: async () => {
          if (await confirm("Вы уверены что хотите открыть новую смену?")) {
            openWorkshift(setEditLoading, token, () => {
              fetchData();
            });
          }
        },
      },
      {
        id: 1,
        title: "Контроль смены",
        icon: <FaRegEdit color="#0F589D" size={20} />,
        onClick: () => setCreateOperationModal(true),
        disabled: !activeWorkshift || activeWorkshift.close_date,
      },
      {
        id: 2,
        title: "Закрыть смену",
        icon: <FaLock color="#9D0F58" size={20} />,
        onClick: async () => {
          if (await confirm("Вы уверены что хотите закрыть текущую смену?")) {
            closeWorkshift(setEditLoading, activeWorkshift?.id, token, () => {
              fetchData();
            });
          }
        },
        disabled: !activeWorkshift || activeWorkshift.close_date,
      },
      {
        id: 3,
        title: "Подробнее о смене",
        icon: <BiZoomIn color="#D90F58" size={20} />,
        onClick: () => navigate(`/workshifts/${page}/${activeWorkshift?.id}`),
        disabled: !activeWorkshift || activeWorkshift.close_date,
      },
    ],
    [confirm, fetchData, token, activeWorkshift, navigate, page]
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
  const dateTypeOptions = useMemo(
    () => [
      { id: "open_date", name: "По дате открытия" },
      { id: "close_date", name: "По дате закрытия" },
    ],
    []
  );
  const sortByOptions = useMemo(
    () => [
      { id: "id", name: "По ID" },
      { id: "open_date", name: "По дате открытия" },
      { id: "close_date", name: "По дате закрытия" },
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
    navigate(`/workshifts/${page}`);
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
        id: "open_date",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "ДАТА ОТКРЫТИЯ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "close_date",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "ДАТА ЗАКРЫТИЯ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "sum",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "СУММА ОПЕРАЦИЙ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
    ],
    []
  );
  const dataForTable = useMemo(
    () =>
      workshifts.map((item, index) => {
        return {
          id: item.id,
          index: index + 1 + (page - 1) * pageSize,
          open_date: moment(item.open_date).format("DD.MM.YYYY HH:mm"),
          close_date: moment(item.close_date).isValid()
            ? moment(item.close_date).format("DD.MM.YYYY HH:mm")
            : "-",
          sum: `${item?.operations?.reduce(
            (sum, item) => sum + (item.positive ? 1 : -1) * item.amount,
            0
          )} ${CURRENCIES[currency]}`,
        };
      }),
    [workshifts, page, pageSize, currency]
  );
  const workshiftInfo = useMemo(() => {
    if (!activeWorkshift) {
      return [];
    }
    const result = [
      { value: "Информация о текущей смене", type: "partTitle" },
      { value: "Ответственный", type: "rowTitle" },
      {
        value: `${activeWorkshift?.userInfo?.name} ${activeWorkshift?.responsible}`,
        type: "rowValue",
      },
      { value: "Дата открытия", type: "rowTitle" },
      {
        value: moment(activeWorkshift?.open_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
    ];
    const totals = {};
    activeWorkshift?.operations?.forEach((item) => {
      if (totals[item.payment_method]) {
        totals[item.payment_method] += (item.positive ? 1 : -1) * item.amount;
      } else {
        totals[item.payment_method] = (item.positive ? 1 : -1) * item.amount;
      }
    });
    if (Object.keys(totals).length !== 0) {
      result.push({ value: "Счета", type: "partTitle" });
    }
    Object.keys(totals).forEach((key) => {
      result.push({
        value: key,
        type: "rowTitle",
      });
      result.push({
        value: `${totals[key]} ${CURRENCIES[currency]}`,
        type: "rowValue",
      });
    });
    return result;
  }, [activeWorkshift, currency]);

  const leftContent = (
    <div>
      <CredButtons credButtons={credButtons} />
      {activeWorkshiftLoading && (
        <div className="LoadingWrapper1">
          <Loading which="gray" />
        </div>
      )}
      {!activeWorkshiftLoading &&
        activeWorkshift &&
        !activeWorkshift.close_date && (
          <div>
            <InfoRows infoRows={workshiftInfo} />
          </div>
        )}
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
          loading={workshiftsLoading}
          currentPage={page}
          totalPages={Math.ceil(filteredTotalCount / pageSize)}
          onPageChange={(page) => {
            setPage(page);
          }}
        />
      </SortFilterPanel>
      {workshiftsLoading ? (
        <div className="LoadingWrapper2">
          <Loading which="gray" />
        </div>
      ) : (
        <TableLayout
          headers={headers}
          data={dataForTable}
          onClickRow={(data) => navigate(`/workshifts/${page}/${data.id}`)}
        />
      )}
      <Modal
        title="Контроль смены"
        modalVisible={createOperationModal}
        setModalVisible={setCreateOperationModal}
        noEscape={editLoading}
      >
        <CreateOperationForm
          setIsLoading={setEditLoading}
          isLoading={editLoading}
          workshiftId={activeWorkshift?.id}
          next={() => {
            setCreateOperationModal(false);
            fetchData();
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
                  loading={workshiftsLoading}
                  setValue={(v) => {
                    setPageSize(v);
                    localStorage.setItem("workshiftsPageSize", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortBy}
                  label="Сортировать по"
                  options={sortByOptions}
                  loading={workshiftsLoading}
                  setValue={(v) => {
                    setSortBy(v);
                    localStorage.setItem("sortWorkshiftsBy", String(v));
                  }}
                />
                <Select
                  defaultOptions={[]}
                  value={sortOrder}
                  label="Порядок сортировки"
                  options={sortOrderOptions}
                  loading={workshiftsLoading}
                  setValue={(v) => {
                    setSortOrder(v);
                    localStorage.setItem("workshiftsSortOrder", String(v));
                  }}
                />
              </FilterSortModalInputContainer>
              <FilterSortModalInputContainer>
                <Select
                  defaultOptions={[]}
                  value={dateType}
                  label="Тип даты"
                  options={dateTypeOptions}
                  loading={workshiftsLoading}
                  setValue={(v) => {
                    setDateType(v);
                    localStorage.setItem("workshiftsDateType", String(v));
                  }}
                />
                <DatePicker
                  disabled={workshiftsLoading}
                  label="Дата от"
                  timeFormat={false}
                  selectedDate={firstDate}
                  handleDateChange={setFirstDate}
                  dateTimeInputFormat="DD.MM.YYYY HH:mm:ss"
                />
                <DatePicker
                  disabled={workshiftsLoading}
                  label="Дата до"
                  timeFormat={false}
                  selectedDate={secondDate}
                  handleDateChange={setSecondDate}
                  dateTimeInputFormat="DD.MM.YYYY HH:mm:ss"
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
      searchButtonLoading={workshiftsLoading}
      searchInputMaxLetters={50}
    />
  );
}

export default Workshifts;

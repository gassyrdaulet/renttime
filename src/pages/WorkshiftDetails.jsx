import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import cl from "../styles/Card.module.css";
import { BiSolidChevronLeft } from "react-icons/bi";
import styled from "styled-components";
import moment from "moment";
import InfoRows from "../components/InfoRows";
import config from "../config/config.json";
import HistoryInfoRows from "../components/HistoryInfoRows";
import { getWorkshift, closeWorkshift } from "../api/OrganizationApi";
import { FaLock, FaRegEdit } from "react-icons/fa";
import useConfirm from "../hooks/useConfirm";
import CreateOperationForm from "../components/CreateOperationForm";
import Modal from "../components/Modal";

const { CURRENCIES, OPERATION_TYPES, SPECIE_STATUSES } = config;

const GoBack = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
`;
const InfoTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  user-select: none;
`;

function WorkshiftDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [createOperationModal, setCreateOperationModal] = useState(false);
  const [data, setData] = useState({});
  const { token, currency } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const fetchData = useCallback(() => {
    getWorkshift(setIsLoading, { workshift_id: params.id }, token, setData);
  }, [token, params.id]);

  const credButtons = useMemo(
    () => [
      {
        id: 1,
        title: "Контроль смены",
        icon: <FaRegEdit color="#0F589D" size={20} />,
        onClick: () => setCreateOperationModal(true),
        disabled: data.close_date,
      },
      {
        id: 2,
        title: "Закрыть смену",
        icon: <FaLock color="#9D0F58" size={20} />,
        onClick: async () => {
          if (await confirm("Вы уверены что хотите закрыть текущую смену?")) {
            closeWorkshift(setEditLoading, params.id, token, () => {
              fetchData();
            });
          }
        },
        disabled: data.close_date,
      },
    ],
    [confirm, fetchData, params.id, token, data]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const infoRows = useMemo(() => {
    if (!data) {
      return [];
    }
    const result = [
      { value: "Информация о текущей смене", type: "partTitle" },
      { value: "Ответственный", type: "rowTitle" },
      {
        value: `${data?.userInfo?.name} ${data?.responsible}`,
        type: "rowValue",
      },
      { value: "Оформленные договора", type: "rowTitle" },
      {
        value: `${data?.orders?.length + data?.archiveOrders?.length}`,
        type: "rowValue",
      },
      { value: "Продления", type: "rowTitle" },
      {
        value: `${data?.extensions?.length}`,
        type: "rowValue",
      },
      { value: "Дата открытия", type: "rowTitle" },
      {
        value: moment(data?.open_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
      { value: "Дата закрытия", type: "rowTitle" },
      {
        value: moment(data?.close_date).isValid
          ? moment(data?.close_date).format("DD.MM.YYYY HH:mm")
          : "-",
        type: "rowValue",
      },
    ];
    const totals = {};
    data?.operations?.forEach((item) => {
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
  }, [data, currency]);

  const operations = useMemo(
    () =>
      data.operations?.map((operation) => ({
        id: operation.id,
        title: `${moment(operation.date).format("DD.MM.YYYY HH:mm")}`,
        values: [
          `Сумма: ${operation.positive ? "" : "-"} ${operation.amount} ${
            CURRENCIES[currency]
          }`,
          `Способ оплаты: ${operation.payment_method}`,
          `Комиссия: ${operation.fee} ${CURRENCIES[currency]}`,
          `Тип операции: ${
            OPERATION_TYPES[operation.type][
              operation.positive ? "positive" : "negative"
            ]
          }`,
        ],
      })),
    [data, currency]
  );

  const discounts = useMemo(
    () =>
      data.discounts?.map((discount) => ({
        id: discount.id,
        title: `${moment(discount.date).format("DD.MM.YYYY HH:mm")}`,
        values: [
          `Сумма: ${discount.amount} ${CURRENCIES[currency]}`,
          `Способ оплаты: ${discount.payment_method}`,
          `ID заказа: ${discount.order_id}`,
          `Причина: ${discount?.reason ? discount.reason : "-"}`,
        ],
      })),
    [data, currency]
  );

  const violations = useMemo(
    () =>
      data.violations?.map((violation) => ({
        id: violation.id,
        title: `${moment(violation.date).format("DD.MM.YYYY HH:mm")}`,
        values: [
          `Способ оплаты: ${violation.payment_method}`,
          `ID заказа: ${violation?.order_id ? violation.order_id : "-"}`,
          `ID единицы: ${violation?.specie_id ? violation.specie_id : "-"}`,
          `ID клиента: ${violation.client_id}`,
          `Тип нарушения: ${SPECIE_STATUSES[violation.specie_violation_type]}`,
          `Комментарий: ${violation?.comment ? violation.comment : "-"}`,
        ],
      })),
    [data]
  );

  const payOffs = useMemo(
    () =>
      data.deliveryPayoffs?.map((payoff) => ({
        id: payoff.id,
        title: `${moment(payoff.date).format("DD.MM.YYYY HH:mm")}`,
        values: [
          `ID курьера: ${payoff.courier}`,
          `Комментарий: ${payoff?.comment ? payoff.comment : "-"}`,
        ],
      })),
    [data]
  );

  const debts = useMemo(
    () =>
      data.debts?.map((debt) => ({
        id: debt.id,
        title: `${moment(debt.date).format("DD.MM.YYYY HH:mm")}`,
        values: [
          `Сумма: ${debt.amount} ${CURRENCIES[currency]}`,
          `ID клиента: ${debt.client_id}`,
          `ID заказа: ${debt?.order_id ? debt.order_id : "-"}`,
          `Закрыт: ${debt?.closed ? "ЗАКРЫТ" : "НЕТ"}`,
          `Комментарий: ${debt?.comment ? debt.comment : "-"}`,
        ],
      })),
    [data, currency]
  );

  const leftContent = (
    <div>
      <GoBack onClick={() => navigate(`/workshifts/${params.page}`)}>
        <div className={cl.IconContainer}>
          <BiSolidChevronLeft size={20} />
        </div>
        <p>Назад ко всем сменам</p>
      </GoBack>
      <CredButtons credButtons={credButtons} />
    </div>
  );

  const mainContent = (
    <div>
      <InfoTitle>Смена: {params.id}</InfoTitle>
      <InfoRows infoRows={infoRows} />
      <HistoryInfoRows title={`Все операции`} historyRows={operations} />
      <HistoryInfoRows title={`Скидки`} historyRows={discounts} />
      <HistoryInfoRows title={`Расчеты с курьерами`} historyRows={payOffs} />
      <HistoryInfoRows title={`Долги`} historyRows={debts} />
      <HistoryInfoRows title={`Нарушения клиентов`} historyRows={violations} />
      <Modal
        title="Контроль смены"
        modalVisible={createOperationModal}
        setModalVisible={setCreateOperationModal}
        noEscape={editLoading}
      >
        <CreateOperationForm
          setIsLoading={setEditLoading}
          isLoading={editLoading}
          workshiftId={params.id}
          next={() => {
            setCreateOperationModal(false);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );

  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={
        isLoading ? (
          <div className="LoadingWrapper2">
            <Loading which="gray" />
          </div>
        ) : (
          mainContent
        )
      }
    />
  );
}

export default WorkshiftDetails;

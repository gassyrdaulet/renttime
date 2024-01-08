import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import {
  BiMoney,
  BiSolidWatch,
  BiSolidChevronLeft,
  BiCar,
  BiFile,
  BiDownload,
  BiSolidCoupon,
  BiMinusCircle,
  BiPen,
  BiMessageAdd,
} from "react-icons/bi";
import styled from "styled-components";
import { useState, useMemo, useEffect, useCallback } from "react";
import GoodPicker from "../components/GoodPicker";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  finishOrder,
  cancelOrder,
  signPhysical,
  sendLink,
  deleteDiscount,
  deletePayment,
  deleteExtension,
} from "../api/OrderApi";
import useAuth from "../hooks/useAuth";
import moment from "moment";
import config from "../config/config.json";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import CreatePaymentForm from "../components/CreatePaymentForm";
import CreateExtensionForm from "../components/CreateExtensionForm";
import CreateNewDelivery from "../components/CreateNewDelivery";
import ConfirmModal from "../components/ConfirmModal";
import Switch from "../components/Switch";
import CreateDiscountForm from "../components/CreateDiscountForm";
import CreatePaymentCourierForm from "../components/CreatePaymentCourierForm";
import BlueLinkButton from "../components/BlueLinkButton";
import EditDeliveryForm from "../components/EditDeliveryForm";
import { cancelDelivery } from "../api/DeliveriesApi";

const {
  TARIFF_MOMENT_KEYS,
  TARIFF_UNITS_2,
  TARIFFS,
  PAPER_AUTHORITY,
  GENDERS,
  CURRENCIES,
  DELIVERY_DIRECTIONS,
  DOMEN,
  DELIVERY_STATUSES,
  SIGN_TYPES,
} = config;

const arraysForSort = ["extensions", "discounts", "payments"];

const GoBack = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
`;
const OrderInfoWrapper = styled.div`
  display: block;
`;
const OrderInfoTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  user-select: none;
`;
const OrderInfoPartTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  margin-top: 10px;
  user-select: none;
`;
const OrderInfoRowTitle = styled.div`
  font-size: 13px;
  color: #aaaaaa;
  margin-top: 5px;
  user-select: none;
`;
const OrderInfoRowValue = styled.div`
  font-size: 14px;
`;
const HistoryItemWrapper = styled.div`
  border: 1px solid #ffccaa;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 2px;
`;

function OrderDetails() {
  const [orderInfo, setOrderInfo] = useState({
    notFound: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editLoading, setEditloading] = useState(false);
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [addPaymentCourierModal, setAddPaymentCourierModal] = useState(false);
  const [addExtensionModal, setAddExtensionModal] = useState(false);
  const [addDeliveryModal, setAddDeliveryModal] = useState(false);
  const [addDiscountModal, setAddDiscountModal] = useState(false);
  const [confirmPhysical, setConfirmPhysical] = useState(false);
  const [confirmSMS, setConfirmSMS] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [isDebtFinish, setIsDebtFinish] = useState(false);
  const [deleteExtensionModal, setDeleteExtensionModal] = useState({});
  const [deletePaymentModal, setDeletePaymentModal] = useState({});
  const [deleteDiscountModal, setDeleteDiscountModal] = useState({});
  const [cancelDeliveryModal, setCancelDeliveryModal] = useState({});
  const [editDeliveryModal, setEditDeliveryModal] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const { token, currency, organizationId } = useAuth();

  const credButtons = useMemo(
    () => [
      {
        id: 0,
        title: "Получить физ. подпись",
        icon: <BiPen color="#0F589D" size={20} />,
        onClick: () => setConfirmPhysical(true),
        disabled: orderInfo.finished_date || orderInfo.signed,
      },
      {
        id: 9,
        title: "Отправить SMS",
        icon: <BiMessageAdd color="#0F589D" size={20} />,
        onClick: () => setConfirmSMS(true),
        disabled: orderInfo.finished_date || orderInfo.signed,
      },
      {
        id: 1,
        title: "Продлить",
        icon: <BiSolidWatch color="#0F589D" size={20} />,
        onClick: () => setAddExtensionModal(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 2,
        title: "Добавить оплату",
        icon: <BiMoney color="#0F9D58" size={20} />,
        onClick: () => setAddPaymentModal(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 3,
        title: "Оплата курьеру",
        icon: <BiMoney color="#0F9D58" size={20} />,
        onClick: () => setAddPaymentCourierModal(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 4,
        title: "Добавить скидку",
        icon: <BiSolidCoupon color="#0F999D" size={20} />,
        onClick: () => setAddDiscountModal(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 5,
        title: "Добавить доставку",
        icon: <BiCar color="#0F999D" size={20} />,
        onClick: () => setAddDeliveryModal(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 6,
        title: "Скачать договор",
        icon: <BiDownload color="#00ccff" size={20} />,
        onClick: () =>
          window.open(
            `${DOMEN}/contract/${organizationId}/${params.id}/${orderInfo.link_code}`
          ),
      },
      {
        id: 7,
        title: "Отменить заказ",
        icon: <BiMinusCircle color="#AC4555" size={20} />,
        onClick: () => setConfirmCancel(true),
        disabled: orderInfo.finished_date,
      },
      {
        id: 8,
        title: "Завершить заказ",
        icon: <BiFile color="#aF09dd" size={20} />,
        onClick: () => setConfirmFinish(true),
        disabled: orderInfo.finished_date,
      },
    ],
    [orderInfo, organizationId, params.id]
  );

  const orderInfoSorted = useMemo(() => {
    if (!orderInfo.notFound) {
      const result = { ...orderInfo };
      for (let key of arraysForSort) {
        result[key] = result[key].sort((a, b) => {
          if (a.date === b.date) {
            return 0;
          } else if (a.date > b.date) {
            return 1;
          } else return -1;
        });
      }
      return result;
    }
    const empty = {};
    for (let key of arraysForSort) {
      empty[key] = [];
    }
    return empty;
  }, [orderInfo]);

  const renttimeTillFinished = useMemo(() => {
    if (!orderInfo.notFound || orderInfo.finished_date) {
      const renttime = moment(orderInfo.finished_date).diff(
        moment(orderInfo.started_date).add(
          orderInfo.forgive_lateness_ms,
          "milliseconds"
        ),
        TARIFF_MOMENT_KEYS[orderInfo.tariff]
      );
      return renttime + 1;
    }
    return 0;
  }, [orderInfo]);

  const renttime = useMemo(() => {
    if (!orderInfo.notFound) {
      let renttime = 0;
      orderInfo.extensions.forEach((item) => (renttime += item.renttime));
      return renttime;
    }
    return 0;
  }, [orderInfo]);

  const delay = useMemo(() => {
    if (!orderInfo.notFound) {
      const delay = moment(
        orderInfo.finished_date ? orderInfo.finished_date : new Date()
      ).diff(
        moment(orderInfo.started_date)
          .add(renttime, TARIFF_MOMENT_KEYS[orderInfo.tariff])
          .add(orderInfo.forgive_lateness_ms, "milliseconds"),
        TARIFF_MOMENT_KEYS[orderInfo.tariff]
      );
      if (delay > 0) {
        return delay + 1;
      } else return 0;
    }
    return 0;
  }, [orderInfo, renttime]);

  const factDelay = useMemo(() => {
    if (!orderInfo.notFound) {
      const delay = moment(
        orderInfo.finished_date ? orderInfo.finished_date : new Date()
      ).diff(
        moment(orderInfo.started_date).add(
          renttime,
          TARIFF_MOMENT_KEYS[orderInfo.tariff]
        ),
        TARIFF_MOMENT_KEYS[orderInfo.tariff]
      );
      if (delay > 0) {
        return delay;
      } else return 0;
    }
    return 0;
  }, [orderInfo, renttime]);

  const paidSum = useMemo(() => {
    if (!orderInfo.notFound) {
      let notVerified = 0;
      let verified = 0;
      orderInfo.payments.forEach((item) => {
        if (item.verified) {
          return (verified += item.amount);
        }
        notVerified += item.amount;
      });
      return { total: verified + notVerified, verified };
    }
    return { total: 0, verified: 0 };
  }, [orderInfo]);

  const factSum = useMemo(() => {
    if (!orderInfo.notFound) {
      let total = 0;
      let totalDeliveryCost = 0;
      let discountSum = 0;
      orderInfo.orderGoods.forEach((item) => {
        total += item.saved_price;
      });
      for (let discount of orderInfo.discounts) {
        discountSum += discount.amount;
      }
      for (let item of orderInfo.deliveries) {
        if (item.cancelled) continue;
        totalDeliveryCost += parseInt(item.delivery_price_for_customer);
      }
      for (let item of orderInfo.archiveDeliveries) {
        if (item.cancelled) continue;
        totalDeliveryCost += parseInt(item.delivery_price_for_customer);
      }
      total =
        (renttimeTillFinished ? renttimeTillFinished : renttime + delay) *
        total;
      return {
        total,
        discountSum,
        totalDeliveryCost,
        sum: total - discountSum + totalDeliveryCost,
      };
    }
    return {
      total: 0,
      discountSum: 0,
      totalDeliveryCost: 0,
      sum: 0,
    };
  }, [orderInfo, renttime, renttimeTillFinished, delay]);

  const orderInfoRows = useMemo(
    () => [
      { value: "Информация о заказе", type: "partTitle" },
      { value: "Тариф", type: "rowTitle" },
      {
        value: TARIFFS[orderInfo.tariff],
        type: "rowValue",
      },
      { value: "Дата создания заказа", type: "rowTitle" },
      {
        value: moment(orderInfo.created_date).format("DD.MM.yyyy HH:mm"),
        type: "rowValue",
      },
      { value: "Дата старта действия договора", type: "rowTitle" },
      {
        value: moment(orderInfo.started_date).format("DD.MM.yyyy HH:mm"),
        type: "rowValue",
      },
      { value: "Договор подписан", type: "rowTitle" },
      {
        value: orderInfo.signed
          ? `ДА (${SIGN_TYPES[orderInfo.sign_type]})`
          : "НЕТ",
        type: "rowValue",
      },
      { value: "Дата подписания договора", type: "rowTitle" },
      {
        value: moment(orderInfo.sign_date).format("DD.MM.yyyy HH:mm"),
        type: "rowValue",
      },

      { value: "Зарегистрированное время", type: "rowTitle" },
      {
        value: `${renttime} ${TARIFF_UNITS_2[orderInfo.tariff]}`,
        type: "rowValue",
      },
      { value: "Фактически прошедшее время", type: "rowTitle" },
      {
        value: `${moment(
          orderInfo.finished_date ? orderInfo.finished_date : new Date()
        ).diff(
          moment(orderInfo.started_date),
          TARIFF_MOMENT_KEYS[orderInfo.tariff]
        )} ${TARIFF_UNITS_2[orderInfo.tariff]}`,
        type: "rowValue",
      },
      {
        value: "Дата запланированного возврата",
        type: "rowTitle",
      },
      {
        value: `${moment(orderInfo.planned_date).format("DD.MM.yyyy HH:mm")} ${
          factDelay >= 0
            ? `(Просрочка: ${factDelay} ${
                TARIFF_UNITS_2[orderInfo.tariff]
              } + 1 неполных ${TARIFF_UNITS_2[orderInfo.tariff]})`
            : ""
        }`,
        type: "rowValue",
      },
      { value: "Простительное время опоздания", type: "rowTitle" },
      {
        value: `${Math.floor(
          orderInfo.forgive_lateness_ms / (1000 * 60 * 60 * 24)
        )} дней ${Math.floor(
          (orderInfo.forgive_lateness_ms % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        )} часов ${Math.floor(
          (orderInfo.forgive_lateness_ms % (1000 * 60 * 60)) / (1000 * 60)
        )} минут`,
        type: "rowValue",
      },
      { value: "Оплаченная сумма", type: "rowTitle" },
      {
        value: `${paidSum.total} ${CURRENCIES[currency]} (Подтвержденной: ${paidSum.verified} ${CURRENCIES[currency]})`,
        type: "rowValue",
      },
      { value: "Сумма за аренду", type: "rowTitle" },
      {
        value: `${factSum.total} ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "Стоимость доставок", type: "rowTitle" },
      {
        value: `${factSum.totalDeliveryCost} ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "Сумма скидки", type: "rowTitle" },
      {
        value: `${factSum.discountSum} ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "Текущая общая сумма к оплате", type: "rowTitle" },
      {
        value: `${factSum.sum} ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "Остаток неоплаченного долга", type: "rowTitle" },
      {
        value: `${
          factSum.sum - paidSum.total > 0
            ? `${factSum.sum - paidSum.total} ${CURRENCIES[currency]}`
            : `0 ${CURRENCIES[currency]}`
        }`,
        type: "rowValue",
      },
      { value: "Дата рассторжения договора", type: "rowTitle" },
      {
        value: orderInfo.finished_date
          ? `${moment(orderInfo.finished_date).format("DD.MM.yyyy HH:mm")} ${
              orderInfo.cancelled ? "(Отменен)" : ""
            }`
          : " - ",
        type: "rowValue",
      },
      { value: "Заметка", type: "rowTitle" },
      {
        value: orderInfo.comment,
        type: "rowValue",
      },
      { value: "Информация о клиенте", type: "partTitle" },
      { value: "ФИО", type: "rowTitle" },
      {
        value: `${orderInfo.clientInfo?.second_name} ${
          orderInfo.clientInfo?.name
        } ${
          orderInfo.clientInfo?.father_name
            ? orderInfo.clientInfo?.father_name
            : ""
        }`,
        type: "rowValue",
      },
      { value: "ИИН", type: "rowTitle" },
      {
        value: orderInfo.clientInfo?.paper_person_id,
        type: "rowValue",
      },
      { value: "Номер документа", type: "rowTitle" },
      {
        value: orderInfo.clientInfo?.paper_serial_number,
        type: "rowValue",
      },
      { value: "Дата выдачи документа", type: "rowTitle" },
      {
        value: moment(orderInfo.clientInfo?.paper_givendate).format(
          "DD.MM.yyyy"
        ),
        type: "rowValue",
      },
      { value: "Документ выдан", type: "rowTitle" },
      {
        value: PAPER_AUTHORITY[orderInfo.clientInfo?.paper_authority],
        type: "rowValue",
      },
      { value: "Номер телефона", type: "rowTitle" },
      {
        value: orderInfo.clientInfo?.cellphone,
        type: "rowValue",
      },
      { value: "Эл. почта", type: "rowTitle" },
      {
        value: orderInfo.clientInfo?.email,
        type: "rowValue",
      },
      { value: "Адрес", type: "rowTitle" },
      {
        value: orderInfo.clientInfo?.address,
        type: "rowValue",
      },
      { value: "Пол и возвраст", type: "rowTitle" },
      {
        value: `${GENDERS[orderInfo.clientInfo?.gender]}, ${moment().diff(
          moment(orderInfo.clientInfo?.paper_person_id?.slice(0, 6), "YYMMDD"),
          "years"
        )}`,
        type: "rowValue",
      },
      { value: "Дата регистрации и количество заказов", type: "rowTitle" },
      {
        value: `${moment(orderInfo.clientInfo?.create_date).format(
          "DD.MM.yyyy"
        )} - ${orderInfo.clientInfo?.orders_count} раз`,
        type: "rowValue",
      },
    ],
    [orderInfo, currency, factSum, renttime, paidSum, factDelay]
  );

  const getOrderDetailsCallback = useCallback(() => {
    getOrderDetails(setIsLoading, token, setOrderInfo, params.id);
  }, [params.id, token]);

  const handleExtensionModal = useCallback((id, value) => {
    setDeleteExtensionModal((prev) => {
      const temp = { ...prev };
      if (temp[id]) {
        temp[id] = value;
        return temp;
      }
      temp[id] = value;
      return temp;
    });
  }, []);

  const handlePaymentModal = useCallback((id, value) => {
    setDeletePaymentModal((prev) => {
      const temp = { ...prev };
      if (temp[id]) {
        temp[id] = value;
        return temp;
      }
      temp[id] = value;
      return temp;
    });
  }, []);

  const handleDiscountModal = useCallback((id, value) => {
    setDeleteDiscountModal((prev) => {
      const temp = { ...prev };
      if (temp[id]) {
        temp[id] = value;
        return temp;
      }
      temp[id] = value;
      return temp;
    });
  }, []);

  const handleEditDeliveryModal = useCallback((id, value) => {
    setEditDeliveryModal((prev) => {
      const temp = { ...prev };
      if (temp[id]) {
        temp[id] = value;
        return temp;
      }
      temp[id] = value;
      return temp;
    });
  }, []);

  const handleCancelDeliveryModal = useCallback((id, value) => {
    setCancelDeliveryModal((prev) => {
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
    getOrderDetailsCallback();
  }, [getOrderDetailsCallback]);

  const leftContent = (
    <div>
      <GoBack
        onClick={() => navigate(`/orders/${params.group}/${params.page}`)}
      >
        <BiSolidChevronLeft size={20} />
        <p>Назад ко всем заказам</p>
      </GoBack>
      <CredButtons
        disabled={isLoading || orderInfo.notFound}
        credButtons={credButtons}
      />
    </div>
  );
  const mainContent = (
    <OrderInfoWrapper>
      <OrderInfoTitle>Заказ ID: {params.id}</OrderInfoTitle>
      <OrderInfoPartTitle>Информация о товарах</OrderInfoPartTitle>
      <GoodPicker
        pickedGoods={orderInfo.orderGoods}
        tariff={orderInfo.tariff}
      />
      {orderInfoRows.map((item, i) => {
        const value = item.value
          ? item.value === "Invalid date"
            ? "-"
            : item.value
          : "-";
        if (item.type === "partTitle") {
          return <OrderInfoPartTitle key={i}>{value}</OrderInfoPartTitle>;
        }
        if (item.type === "rowTitle") {
          return <OrderInfoRowTitle key={i}>{value}</OrderInfoRowTitle>;
        }
        if (item.type === "rowValue") {
          return <OrderInfoRowValue key={i}>{value}</OrderInfoRowValue>;
        }
        return "";
      })}
      <OrderInfoPartTitle>История продлений</OrderInfoPartTitle>
      {orderInfo.extensions?.length === 0 && (
        <OrderInfoRowValue>Продлений еще не было</OrderInfoRowValue>
      )}
      {orderInfoSorted.extensions.map((item) => (
        <HistoryItemWrapper key={item.id}>
          <OrderInfoRowTitle
            title={`ID: ${item.userInfo?.id} | ${item.userInfo?.cellphone}`}
          >
            ID: {item.id} - {moment(item?.date).format("DD.MM.YYYY HH:mm")} -{" "}
            {item?.userInfo?.name} - ID смены: {item?.workshift_id}
          </OrderInfoRowTitle>
          <OrderInfoRowValue>
            {item.renttime} {TARIFF_UNITS_2[orderInfo.tariff]}
          </OrderInfoRowValue>
          <BlueLinkButton
            padding="0 0 5px 0"
            text="Удалить"
            onClick={() => handleExtensionModal(item.id, true)}
          />
          <ConfirmModal
            visible={deleteExtensionModal[item.id]}
            setVisible={(v) => handleExtensionModal(item.id, v)}
            loading={editLoading}
            title="Удалить продление"
            question={`Вы уверены что хотите удалить это продление? (ID: ${item.id})`}
            onConfirm={() =>
              deleteExtension(setEditloading, token, item.id, () => {
                setAddExtensionModal(false);
                getOrderDetailsCallback();
              })
            }
          />
        </HistoryItemWrapper>
      ))}
      <OrderInfoPartTitle>История оплат</OrderInfoPartTitle>
      {orderInfo.payments?.length === 0 && (
        <OrderInfoRowValue>Оплат еще не было</OrderInfoRowValue>
      )}
      {orderInfoSorted.payments.map((item) => {
        return (
          <HistoryItemWrapper key={item.id}>
            <OrderInfoRowTitle
              title={`ID: ${item.userInfo?.id} | ${item.userInfo?.cellphone}`}
            >
              ID: {item.id} - {moment(item?.date).format("DD.MM.YYYY HH:mm")} -{" "}
              {item?.userInfo?.name} - ID смены: {item?.workshift_id}
            </OrderInfoRowTitle>
            <OrderInfoRowValue>
              {item.amount} {CURRENCIES[currency]} (Комиссия: {item.fee}{" "}
              {CURRENCIES[currency]} - {item.type})
            </OrderInfoRowValue>
            <OrderInfoRowValue>
              Подтвержден:{" "}
              {item.verified
                ? moment(item.verified_date).format("DD:MM:YYYY HH:mm")
                : "НЕТ"}
            </OrderInfoRowValue>
            <OrderInfoRowValue>
              Для курьера:{" "}
              {item.for_courier ? `ID доставки: ${item.delivery_id}` : "НЕТ"}
            </OrderInfoRowValue>
            <OrderInfoRowValue>
              Долг: {item.is_debt ? `ID долга: ${item.debt_id}` : "НЕТ"}
            </OrderInfoRowValue>
            <BlueLinkButton
              padding="0 0 5px 0"
              text="Удалить"
              onClick={() => handlePaymentModal(item.id, true)}
            />
            <ConfirmModal
              visible={deletePaymentModal[item.id]}
              setVisible={(v) => handlePaymentModal(item.id, v)}
              loading={editLoading}
              title="Удалить оплату"
              question={`Вы уверены что хотите удалить эту оплату? (ID: ${item.id})`}
              onConfirm={() =>
                deletePayment(setEditloading, token, item.id, () => {
                  setDeletePaymentModal(false);
                  getOrderDetailsCallback();
                })
              }
            />
          </HistoryItemWrapper>
        );
      })}
      <OrderInfoPartTitle>История скидок</OrderInfoPartTitle>
      {orderInfo.discounts?.length === 0 && (
        <OrderInfoRowValue>Скидок еще не было</OrderInfoRowValue>
      )}
      {orderInfoSorted.discounts.map((item) => (
        <HistoryItemWrapper key={item.id}>
          <OrderInfoRowTitle
            title={`ID: ${item.userInfo?.id} | ${item.userInfo?.cellphone}`}
          >
            ID: {item.id} - {moment(item?.date).format("DD.MM.YYYY HH:mm")} -{" "}
            {item?.userInfo?.name} - ID смены: {item?.workshift_id}
          </OrderInfoRowTitle>
          <OrderInfoRowValue>
            {item.amount} {CURRENCIES[currency]}
          </OrderInfoRowValue>
          <OrderInfoRowValue>Причина: {item.reason}</OrderInfoRowValue>
          <BlueLinkButton
            padding="0 0 5px 0"
            text="Удалить"
            onClick={() => handleDiscountModal(item.id, true)}
          />
          <ConfirmModal
            visible={deleteDiscountModal[item.id]}
            setVisible={(v) => handleDiscountModal(item.id, v)}
            loading={editLoading}
            title="Удалить скидку"
            question={`Вы уверены что хотите удалить эту скидку? (ID: ${item.id})`}
            onConfirm={() =>
              deleteDiscount(setEditloading, token, item.id, () => {
                setDeleteDiscountModal(false);
                getOrderDetailsCallback();
              })
            }
          />
        </HistoryItemWrapper>
      ))}
      <OrderInfoPartTitle>Информация о доставке</OrderInfoPartTitle>
      {orderInfo.deliveries?.length === 0 &&
        orderInfo.archiveDeliveries?.length === 0 && (
          <OrderInfoRowValue>
            Оформленных доставок еще не было
          </OrderInfoRowValue>
        )}
      {orderInfo.deliveries?.map((item) => (
        <HistoryItemWrapper key={item.id}>
          <OrderInfoRowTitle
            title={`ID: ${item.userInfo?.id} | ${item.userInfo?.cellphone}`}
          >
            ID: {item.id} -{" "}
            {moment(item?.created_date).format("DD.MM.YYYY HH:mm")} -{" "}
            {DELIVERY_DIRECTIONS[item.direction]} - {item?.userInfo?.name} - ID
            смены: {item?.workshift_id}
          </OrderInfoRowTitle>
          <OrderInfoRowValue>{item.address}</OrderInfoRowValue>
          <OrderInfoRowValue>{item.cellphone}</OrderInfoRowValue>
          <OrderInfoRowValue>
            Статус: [
            {item.cancelled
              ? "ОТМЕНЕНА"
              : DELIVERY_STATUSES[item.status].toUpperCase()}
            ]
          </OrderInfoRowValue>
          <OrderInfoRowValue>
            Стоимость доставки для клиента: {item.delivery_price_for_customer}{" "}
            {CURRENCIES[currency]}
          </OrderInfoRowValue>
          <OrderInfoRowValue>
            Стоимость доставки для курьера: {item.delivery_price_for_deliver}{" "}
            {CURRENCIES[currency]}
          </OrderInfoRowValue>
          {(item.status === "new" || item.status === "wfd") && (
            <div>
              <BlueLinkButton
                padding="0 0 5px 0"
                text="Отредактировать"
                onClick={() => handleEditDeliveryModal(item.id, true)}
              />
              <BlueLinkButton
                padding="0 0 5px 0"
                text="Отменить"
                onClick={() => handleCancelDeliveryModal(item.id, true)}
              />
            </div>
          )}
          <Modal
            title={`Редактировать доставку (ID: ${item.id})`}
            setModalVisible={(v) => handleEditDeliveryModal(item.id, v)}
            modalVisible={editDeliveryModal[item.id]}
            noEscape={editLoading || isLoading}
            onlyByClose={true}
          >
            <EditDeliveryForm
              deliveryInfo={item}
              isLoading={editLoading}
              setIsLoading={setEditloading}
              next={() => {
                setEditDeliveryModal(false);
                getOrderDetailsCallback();
              }}
            />
          </Modal>
          <ConfirmModal
            visible={cancelDeliveryModal[item.id]}
            setVisible={(v) => handleCancelDeliveryModal(item.id, v)}
            loading={editLoading}
            title="Отмена доставки"
            question={`Вы уверены что хотите отменить эту доставку? (ID: ${item.id})`}
            onConfirm={() =>
              cancelDelivery(setEditloading, token, item.id, () => {
                setCancelDeliveryModal(false);
                getOrderDetailsCallback();
              })
            }
          />
        </HistoryItemWrapper>
      ))}
      {orderInfo.archiveDeliveries?.map((item) => (
        <HistoryItemWrapper key={item.id}>
          <OrderInfoRowTitle
            title={`ID: ${item.userInfo?.id} | ${item.userInfo?.cellphone}`}
          >
            ID: {item.id} -{" "}
            {moment(item?.created_date).format("DD.MM.YYYY HH:mm")} -{" "}
            {DELIVERY_DIRECTIONS[item.direction]} - {item?.userInfo?.name} - ID
            смены: {item?.workshift_id}
          </OrderInfoRowTitle>
          <OrderInfoRowValue>{item.address}</OrderInfoRowValue>
          <OrderInfoRowValue>{item.cellphone}</OrderInfoRowValue>
          <OrderInfoRowValue>
            Статус: [
            {item.cancelled
              ? "ОТМЕНЕНА"
              : DELIVERY_STATUSES[item.status].toUpperCase()}
            ]
          </OrderInfoRowValue>
          <OrderInfoRowValue>
            Стоимость доставки для клиента: {item.delivery_price_for_customer}{" "}
            {CURRENCIES[currency]}
          </OrderInfoRowValue>
          <OrderInfoRowValue>
            Стоимость доставки для курьера: {item.delivery_price_for_deliver}{" "}
            {CURRENCIES[currency]}
          </OrderInfoRowValue>
          {(item.status === "new" || item.status === "wfd") && (
            <div>
              <BlueLinkButton
                padding="0 0 5px 0"
                text="Отредактировать"
                onClick={() => handleEditDeliveryModal(item.id, true)}
              />
              <BlueLinkButton
                padding="0 0 5px 0"
                text="Отменить"
                onClick={() => handleCancelDeliveryModal(item.id, true)}
              />
            </div>
          )}
          <Modal
            title={`Редактировать доставку (ID: ${item.id})`}
            setModalVisible={(v) => handleEditDeliveryModal(item.id, v)}
            modalVisible={editDeliveryModal[item.id]}
            noEscape={editLoading || isLoading}
            onlyByClose={true}
          >
            <EditDeliveryForm
              cellphone={orderInfo.clientInfo?.cellphone}
              address={orderInfo.clientInfo?.address}
              createDeliveryLoading={editLoading}
              setCreateDeliveryLoading={setEditloading}
              orderId={params.id}
              next={() => {
                setEditDeliveryModal(false);
                getOrderDetailsCallback();
              }}
            />
          </Modal>
          <ConfirmModal
            visible={cancelDeliveryModal[item.id]}
            setVisible={(v) => handleCancelDeliveryModal(item.id, v)}
            loading={editLoading}
            title="Отмена доставки"
            question={`Вы уверены что хотите отменить эту доставку? (ID: ${item.id})`}
            onConfirm={() =>
              cancelDelivery(setEditloading, token, item.id, () => {
                setCancelDeliveryModal(false);
                getOrderDetailsCallback();
              })
            }
          />
        </HistoryItemWrapper>
      ))}
      <Modal
        title="Новая оплата"
        setModalVisible={setAddPaymentModal}
        modalVisible={addPaymentModal}
        noEscape={editLoading || isLoading}
        onlyByClose={true}
      >
        <CreatePaymentForm
          createPaymentLoading={editLoading}
          setCreatePaymentLoading={setEditloading}
          orderId={params.id}
          next={() => {
            setAddPaymentModal(false);
            getOrderDetailsCallback();
          }}
        />
      </Modal>
      <Modal
        title="Оплата курьеру"
        setModalVisible={setAddPaymentCourierModal}
        modalVisible={addPaymentCourierModal}
        noEscape={editLoading || isLoading}
        onlyByClose={true}
      >
        <CreatePaymentCourierForm
          createPaymentLoading={editLoading}
          setCreatePaymentLoading={setEditloading}
          orderId={params.id}
          deliveries={orderInfo.deliveries}
          next={() => {
            setAddPaymentCourierModal(false);
            getOrderDetailsCallback();
          }}
        />
      </Modal>
      <Modal
        title="Новое продление"
        setModalVisible={setAddExtensionModal}
        modalVisible={addExtensionModal}
        noEscape={editLoading || isLoading}
        onlyByClose={true}
      >
        <CreateExtensionForm
          createExtensionLoading={editLoading}
          setCreateExtensionLoading={setEditloading}
          orderId={params.id}
          tariff={orderInfo.tariff}
          next={() => {
            setAddExtensionModal(false);
            getOrderDetailsCallback();
          }}
        />
      </Modal>
      <Modal
        title="Новая скидка"
        setModalVisible={setAddDiscountModal}
        modalVisible={addDiscountModal}
        noEscape={editLoading || isLoading}
        onlyByClose={true}
      >
        <CreateDiscountForm
          createDiscountLoading={editLoading}
          setCreateDiscountLoading={setEditloading}
          orderId={params.id}
          next={() => {
            setAddDiscountModal(false);
            getOrderDetailsCallback();
          }}
        />
      </Modal>
      <Modal
        title="Новая доставка"
        setModalVisible={setAddDeliveryModal}
        modalVisible={addDeliveryModal}
        noEscape={editLoading || isLoading}
        onlyByClose={true}
      >
        <CreateNewDelivery
          cellphone={orderInfo.clientInfo?.cellphone}
          address={orderInfo.clientInfo?.address}
          createDeliveryLoading={editLoading}
          setCreateDeliveryLoading={setEditloading}
          orderId={params.id}
          next={() => {
            setAddDeliveryModal(false);
            getOrderDetailsCallback();
          }}
        />
      </Modal>
      <ConfirmModal
        visible={confirmFinish}
        setVisible={setConfirmFinish}
        loading={editLoading}
        title="Подтвердите действие"
        question={
          <div>
            <p>Вы уверены что хотите завершить этот заказ?</p>
            <Switch
              label="Записать недостающую оплату в долг"
              isChecked={isDebtFinish}
              setChecked={setIsDebtFinish}
              disabled={editLoading}
            />
          </div>
        }
        onConfirm={() =>
          finishOrder(setEditloading, token, params.id, isDebtFinish, () => {
            setConfirmFinish(false);
            getOrderDetailsCallback();
          })
        }
      />
      <ConfirmModal
        visible={confirmCancel}
        setVisible={setConfirmCancel}
        loading={editLoading}
        title="Подтвердите действие"
        question={
          <div>
            <p>Вы уверены что хотите отменить этот заказ?</p>
          </div>
        }
        onConfirm={() =>
          cancelOrder(setEditloading, token, params.id, () => {
            setConfirmCancel(false);
            getOrderDetailsCallback();
          })
        }
      />
      <ConfirmModal
        visible={confirmPhysical}
        setVisible={setConfirmPhysical}
        loading={editLoading}
        title="Подтвердите действие"
        question={
          <div>
            <p>
              Вы получаете физическую подпись. Убедитесь в сохранности документа
              договора и сохраните его до рассторжения договора.{" "}
            </p>
          </div>
        }
        onConfirm={() =>
          signPhysical(setEditloading, token, params.id, () => {
            setConfirmPhysical(false);
            getOrderDetailsCallback();
          })
        }
      />
      <ConfirmModal
        visible={confirmSMS}
        setVisible={setConfirmSMS}
        loading={editLoading}
        title="Подтвердите действие"
        question={
          <div>
            <p>
              Вы уверены что хотите отправить СМС с ссылкой на договор этому
              клиенту?
            </p>
          </div>
        }
        onConfirm={() =>
          sendLink(
            setEditloading,
            token,
            orderInfo.id,
            orderInfo.link_code,
            () => {
              setConfirmSMS(false);
              getOrderDetailsCallback();
            }
          )
        }
      />
    </OrderInfoWrapper>
  );
  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={
        isLoading ? (
          <div className="LoadingWrapper2">
            <Loading which="gray" />
          </div>
        ) : orderInfo.notFound ? (
          <div className="LoadingWrapper2">
            <p>Заказ ID{params.id} не найден</p>
          </div>
        ) : (
          mainContent
        )
      }
    />
  );
}

export default OrderDetails;

import ContainerLayout from "../components/ContainerLayout";
import CredButtons from "../components/CredButtons";
import {
  BiPaperPlane,
  BiMinusCircle,
  BiSolidChevronLeft,
  BiCheckCircle,
  BiSolidToTop,
} from "react-icons/bi";
import styled from "styled-components";
import { useState, useMemo, useEffect, useCallback } from "react";
import GoodPicker from "../components/GoodPicker";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import moment from "moment";
import config from "../config/config.json";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import {
  getDeliveryDetails,
  refuseDelivery,
  issueDelivery,
} from "../api/DeliveriesApi";
import ConfirmModal from "../components/ConfirmModal";
import SendCourierForm from "../components/SendCourierForm";
import PayOffForm from "../components/PayoffForm";

const { CURRENCIES, DELIVERY_DIRECTIONS, DELIVERY_STATUSES } = config;

const GoBack = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
`;
const DeliveryInfoWrapper = styled.div`
  display: block;
`;
const DeliveryInfoTitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
  user-select: none;
`;
const DeliveryInfoPartTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  margin-top: 10px;
  user-select: none;
`;
const DeliveryInfoRowTitle = styled.div`
  font-size: 13px;
  color: #aaaaaa;
  margin-top: 5px;
  user-select: none;
`;
const DeliveryInfoRowValue = styled.div`
  font-size: 14px;
`;
const HistoryItemWrapper = styled.div`
  border: 1px solid #ffccaa;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 2px;
`;

function DeliveryDetails() {
  const [deliveryInfo, setDeliveryInfo] = useState({
    notFound: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editLoading, setEditloading] = useState(false);
  const [sendCourierModal, setSendCourierModal] = useState(false);
  const [payoffModal, setPayoffModal] = useState(false);
  const [confirmIssueModal, setConfirmIssueModal] = useState(false);
  const [confirmRefuseModal, setConfirmRefuseModal] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { token, currency } = useAuth();

  const credButtons = useMemo(
    () => [
      {
        id: 2,
        title: "Отправить",
        icon: <BiPaperPlane color="#0F589D" size={20} />,
        onClick: () => setSendCourierModal(true),
      },
      {
        id: 3,
        title: "Подтвердить",
        icon: <BiCheckCircle color="#0F9D58" size={20} />,
        onClick: () => setPayoffModal(true),
      },
      {
        id: 0,
        title: "Выдать",
        icon: <BiSolidToTop color="#0F9D58" size={20} />,
        onClick: () => setConfirmIssueModal(true),
      },
      {
        id: 1,
        title: "Отказаться от доставки",
        icon: <BiMinusCircle color="#FF2222" size={20} />,
        onClick: () => setConfirmRefuseModal(true),
      },
    ],
    []
  );

  const paySum = useMemo(() => {
    const result = { total: 0 };
    if (!deliveryInfo.orderInfo) {
      return result;
    } else {
      deliveryInfo.orderInfo.payments.forEach((item) => {
        result.total += item.amount;
        if (result[item.type]) {
          return (result[item.type] += item.amount);
        }
        result[item.type] = item.amount;
      });
      return result;
    }
  }, [deliveryInfo]);

  const deliveryInfoRows = useMemo(
    () => [
      { value: "Информация о доставке", type: "partTitle" },
      { value: "Статус", type: "rowTitle" },
      {
        value: DELIVERY_STATUSES[deliveryInfo.status]?.toUpperCase(),
        type: "rowValue",
      },
      { value: "Отменена", type: "rowTitle" },
      {
        value: deliveryInfo.cancelled ? "ДА" : "НЕТ",
        type: "rowValue",
      },
      { value: "Дата создания", type: "rowTitle" },
      {
        value: moment(deliveryInfo.created_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
      { value: "Направление", type: "rowTitle" },
      {
        value: DELIVERY_DIRECTIONS[deliveryInfo.direction]?.toUpperCase(),
        type: "rowValue",
      },
      { value: "Адрес", type: "rowTitle" },
      {
        value: deliveryInfo.address,
        type: "rowValue",
      },
      { value: "Номер телефона", type: "rowTitle" },
      {
        value: deliveryInfo.cellphone,
        type: "rowValue",
      },
      { value: "Сумма к оплате от клиента", type: "rowTitle" },
      {
        value: paySum.total + ` ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "Оплата курьеру за доставку", type: "rowTitle" },
      {
        value:
          deliveryInfo.delivery_price_for_deliver + ` ${CURRENCIES[currency]}`,
        type: "rowValue",
      },

      { value: "Детали доставки", type: "partTitle" },
      { value: "Дата отправления", type: "rowTitle" },
      {
        value: moment(deliveryInfo.went_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
      { value: "Дата поступления в обработку", type: "rowTitle" },
      {
        value: moment(deliveryInfo.delivered_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
      { value: "Дата расчета", type: "rowTitle" },
      {
        value: moment(deliveryInfo.finished_date).format("DD.MM.YYYY HH:mm"),
        type: "rowValue",
      },
      { value: "Заметка", type: "rowTitle" },
      {
        value: deliveryInfo.comment,
        type: "rowValue",
      },
      { value: "Менеджер", type: "rowTitle" },
      {
        value: deliveryInfo.author?.name + ` (ID: ${deliveryInfo.user_id})`,
        type: "rowValue",
      },
      { value: "Курьер", type: "rowTitle" },
      {
        value: deliveryInfo.courier_id
          ? deliveryInfo.courier?.name + ` (ID: ${deliveryInfo.courier_id})`
          : " - ",
        type: "rowValue",
      },
      { value: "Клиент оплатит за доставку", type: "rowTitle" },
      {
        value:
          deliveryInfo.delivery_price_for_customer + ` ${CURRENCIES[currency]}`,
        type: "rowValue",
      },
      { value: "ID заказа ", type: "rowTitle" },
      {
        value: deliveryInfo.order_id,
        type: "rowValue",
      },
      { value: "ID смены ", type: "rowTitle" },
      {
        value: deliveryInfo.workshift_id,
        type: "rowValue",
      },
      { value: "ID расчета ", type: "rowTitle" },
      {
        value: deliveryInfo.payoff_id,
        type: "rowValue",
      },
    ],
    [deliveryInfo, currency, paySum.total]
  );

  const getDeliveryDetailsCallback = useCallback(() => {
    getDeliveryDetails(setIsLoading, token, setDeliveryInfo, params.id);
  }, [params.id, token]);

  useEffect(() => {
    getDeliveryDetailsCallback();
  }, [getDeliveryDetailsCallback]);

  const leftContent = (
    <div>
      <GoBack
        onClick={() => navigate(`/deliveries/${params.group}/${params.page}`)}
      >
        <BiSolidChevronLeft size={20} />
        <p>Назад ко всем доставкам</p>
      </GoBack>
      <CredButtons
        disabled={isLoading || deliveryInfo.notFound}
        credButtons={credButtons}
      />
    </div>
  );
  const mainContent = (
    <DeliveryInfoWrapper>
      <DeliveryInfoTitle>Доставка ID: {params.id}</DeliveryInfoTitle>
      <DeliveryInfoPartTitle>Информация о товарах</DeliveryInfoPartTitle>
      <GoodPicker
        pickedGoods={deliveryInfo?.orderInfo?.orderGoods}
        tariff={deliveryInfo?.orderInfo?.tariff}
      />
      {deliveryInfoRows.map((item, i) => {
        const value = item.value
          ? item.value === "Invalid date"
            ? "-"
            : item.value
          : "-";
        if (item.type === "partTitle") {
          return <DeliveryInfoPartTitle key={i}>{value}</DeliveryInfoPartTitle>;
        }
        if (item.type === "rowTitle") {
          return <DeliveryInfoRowTitle key={i}>{value}</DeliveryInfoRowTitle>;
        }
        if (item.type === "rowValue") {
          return <DeliveryInfoRowValue key={i}>{value}</DeliveryInfoRowValue>;
        }
        return "";
      })}
      <DeliveryInfoPartTitle>
        Информация о требуемой оплате
      </DeliveryInfoPartTitle>
      {deliveryInfo.orderInfo?.payments?.length === 0 && (
        <DeliveryInfoRowValue>Оплат не требуется</DeliveryInfoRowValue>
      )}
      {deliveryInfo.orderInfo?.payments?.map((item) => (
        <HistoryItemWrapper key={item.id}>
          <DeliveryInfoRowTitle>ID оплаты: {item.id}</DeliveryInfoRowTitle>
          <DeliveryInfoRowValue>
            {item.amount} {CURRENCIES[currency]} ({item.type})
          </DeliveryInfoRowValue>
        </HistoryItemWrapper>
      ))}
      <ConfirmModal
        title="Выдача доставки"
        setVisible={setConfirmIssueModal}
        visible={confirmIssueModal}
        loading={editLoading || isLoading}
        onlyByClose={true}
        question={`Осуществляя выдачу этой доставки вы подтверждаете что вы получили необходимую сумму: ${paySum.total} ${CURRENCIES[currency]}`}
        onConfirm={() =>
          issueDelivery(setEditloading, token, params.id, () => {
            setConfirmIssueModal(false);
            getDeliveryDetailsCallback();
          })
        }
      />
      <ConfirmModal
        title="Отказ от доставки"
        setVisible={setConfirmRefuseModal}
        visible={confirmRefuseModal}
        loading={editLoading || isLoading}
        onlyByClose={true}
        question={`Вы уверены что хотите отказаться от этой доставки? После подтверждения эта заявка окажется в новых доставках`}
        onConfirm={() =>
          refuseDelivery(setEditloading, token, params.id, () => {
            setConfirmRefuseModal(false);
            getDeliveryDetailsCallback();
          })
        }
      />
      <Modal
        title="Отправить доставку"
        setModalVisible={setSendCourierModal}
        modalVisible={sendCourierModal}
        noEscape={isLoading || editLoading}
        onlyByClose={true}
      >
        <SendCourierForm
          isLoading={editLoading}
          setIsLoading={setEditloading}
          deliveries={[{ delivery_id: params.id }]}
          next={() => {
            setSendCourierModal(false);
            getDeliveryDetailsCallback();
          }}
        />
      </Modal>
      <Modal
        title={`Расчет с курьером ${
          deliveryInfo.courier?.name ? deliveryInfo.courier?.name : ""
        }`}
        setModalVisible={setPayoffModal}
        modalVisible={payoffModal}
        noEscape={isLoading || editLoading}
        onlyByClose={true}
      >
        <PayOffForm
          isLoading={editLoading}
          setIsLoading={setEditloading}
          deliveries={[deliveryInfo]}
          next={() => {
            setPayoffModal(false);
            getDeliveryDetailsCallback();
          }}
        />
      </Modal>
    </DeliveryInfoWrapper>
  );
  return (
    <ContainerLayout
      leftContent={leftContent}
      mainContent={
        isLoading ? (
          <div className="LoadingWrapper2">
            <Loading which="gray" />
          </div>
        ) : deliveryInfo.notFound ? (
          <div className="LoadingWrapper2">
            <p>Доставка ID:{params.id} не найдена</p>
          </div>
        ) : (
          mainContent
        )
      }
    />
  );
}

export default DeliveryDetails;

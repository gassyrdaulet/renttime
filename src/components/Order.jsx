import styled from "styled-components";
import moment from "moment";
import config from "../config/config.json";
import { useMemo } from "react";
import { BiCheckCircle, BiMinusCircle, BiStopwatch } from "react-icons/bi";

const { TARIFF_MOMENT_KEYS, TARIFFS } = config;

const OrderContainer = styled.div`
  box-sizing: border-box;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
  width: 100%;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  border: 2px solid ${(props) => props.style?.colorOfOrder};
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.1s;
  &:hover {
    background-color: #efefef;
  }
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px;
  margin-top: 5px;
`;
const ColumnInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const InfoTitle = styled.p`
  font-size: 8px;
`;
const InfoValue = styled.p`
  text-align: center;
  font-size: 10px;
  color: ${(props) => props.style?.textColor};
  font-weight: ${(props) => props.style?.textWeight};
`;

function Order({ orderItem, onClick }) {
  const renttimeTillFinished = useMemo(() => {
    if (orderItem.finished_date) {
      const renttime = moment(orderItem.finished_date).diff(
        moment(orderItem.started_date).add(
          orderItem.forgive_lateness_ms,
          "milliseconds"
        ),
        TARIFF_MOMENT_KEYS[orderItem.tariff]
      );
      return renttime + 1;
    }
    return 0;
  }, [orderItem]);

  const renttime = useMemo(() => {
    let renttime = 0;
    for (let extension of orderItem.extensions) {
      renttime += extension.renttime;
    }
    return renttime;
  }, [orderItem]);

  const delay = useMemo(() => {
    const delay = moment().diff(
      moment(orderItem.planned_date).add(
        orderItem.forgive_lateness_ms,
        "milliseconds"
      ),
      TARIFF_MOMENT_KEYS[orderItem.tariff]
    );
    if (delay > 0) {
      return delay + 1;
    } else return 0;
  }, [orderItem]);

  const totals = useMemo(() => {
    let total = 0;
    let totalDeliveryCost = 0;
    let discountSum = 0;
    let paymentSum = 0;
    orderItem.orderGoods.forEach((item) => {
      total += item.saved_price;
    });
    for (let discount of orderItem.discounts) {
      discountSum += discount.amount;
    }
    for (let payment of orderItem.payments) {
      paymentSum += payment.amount;
    }
    for (let item of orderItem.deliveries) {
      if (item.cancelled) continue;
      totalDeliveryCost += parseInt(item.delivery_price_for_customer);
    }
    for (let item of orderItem.archiveDeliveries) {
      if (item.cancelled) continue;
      totalDeliveryCost += parseInt(item.delivery_price_for_customer);
    }
    total =
      (renttimeTillFinished ? renttimeTillFinished : renttime + delay + 1) *
        total +
      totalDeliveryCost;
    const totalWithDiscount = total - discountSum;
    return {
      total: { title: "Сумма:", value: total },
      discountSum: { title: "Скидка:", value: discountSum },
      totalWithDiscount: {
        title: "Сумма со скидкой:",
        value: totalWithDiscount,
        valueFontSize: 22,
      },
      paymentSum: {
        title: "Оплаченная сумма:",
        value: paymentSum,
        valueFontSize: 22,
      },
    };
  }, [orderItem, delay, renttime, renttimeTillFinished]);

  const colorOfOrder = useMemo(() => {
    if (!orderItem.signed) {
      return "blue";
    }
    if (orderItem.finished_date) {
      return "green";
    }
    if (
      moment(orderItem.planned_date) < moment() ||
      totals.paymentSum.value < totals.totalWithDiscount.value
    ) {
      return "red";
    }
    if (
      moment(orderItem.planned_date).diff(
        moment(),
        TARIFF_MOMENT_KEYS[orderItem.tariff]
      ) < 1
    ) {
      return "orange";
    }
    return "green";
  }, [orderItem, totals]);

  const colorOfPlannedDate = useMemo(() => {
    if (moment(orderItem.planned_date) < moment()) {
      return "red";
    }
    if (
      moment(orderItem.planned_date).diff(
        moment(),
        TARIFF_MOMENT_KEYS[orderItem.tariff]
      ) < 1
    ) {
      return "orange";
    }
    return "green";
  }, [orderItem]);

  return (
    <OrderContainer
      onClick={onClick}
      style={{
        colorOfOrder,
      }}
    >
      <InfoRow>
        <ColumnInfo>
          <InfoValue>ID: {orderItem.id}</InfoValue>
        </ColumnInfo>
      </InfoRow>
      <InfoRow>
        <ColumnInfo>
          <InfoValue>
            {orderItem.clientInfo?.second_name} {orderItem.clientInfo?.name}{" "}
            {orderItem.clientInfo?.father_name}
          </InfoValue>
        </ColumnInfo>
      </InfoRow>
      <InfoRow>
        <ColumnInfo>
          <InfoTitle>СТАРТ</InfoTitle>
          <InfoValue>
            {moment(orderItem.started_date).format("HH:mm")}
          </InfoValue>
          <InfoValue>
            {moment(orderItem.started_date).format("DD.MM.yyyy")}
          </InfoValue>
        </ColumnInfo>
        {orderItem.finished_date ? (
          <ColumnInfo>
            <InfoTitle>РАССТОРГНУТ</InfoTitle>
            <InfoValue>
              {moment(orderItem.finished_date).format("HH:mm")}
            </InfoValue>
            <InfoValue>
              {moment(orderItem.finished_date).format("DD.MM.yyyy")}
            </InfoValue>
          </ColumnInfo>
        ) : (
          <ColumnInfo>
            <InfoTitle>ПЛАН</InfoTitle>
            <InfoValue
              style={{
                textColor: colorOfPlannedDate,
                textWeight:
                  moment(orderItem.planned_date) < moment() ? "600" : "500",
              }}
            >
              {moment(orderItem.planned_date).format("HH:mm")}
            </InfoValue>
            <InfoValue
              style={{
                textColor: colorOfPlannedDate,
                textWeight:
                  moment(orderItem.planned_date) < moment() ? "600" : "500",
              }}
            >
              {moment(orderItem.planned_date).format("DD.MM.yyyy")}
            </InfoValue>
          </ColumnInfo>
        )}
      </InfoRow>
      <InfoRow>
        <ColumnInfo>
          <InfoTitle>ОПЛАТА</InfoTitle>
          <InfoValue
            style={{
              textWeight:
                totals.paymentSum.value < totals.totalWithDiscount.value
                  ? "600"
                  : "500",
              textColor:
                totals.paymentSum.value < totals.totalWithDiscount.value
                  ? "red"
                  : "green",
            }}
          >
            {totals.paymentSum.value}/{totals.totalWithDiscount.value}
          </InfoValue>
        </ColumnInfo>
        <ColumnInfo>
          <InfoTitle>ТАРИФ</InfoTitle>
          <InfoValue>{TARIFFS[orderItem.tariff]}</InfoValue>
        </ColumnInfo>
      </InfoRow>
      <InfoRow>
        <ColumnInfo>
          <InfoTitle>ПОДПИСАНО</InfoTitle>
          <InfoValue>
            {orderItem.signed ? (
              <BiCheckCircle color="green" />
            ) : (
              <BiMinusCircle color="red" />
            )}
          </InfoValue>
        </ColumnInfo>
        {orderItem.cancelled ? (
          <ColumnInfo>
            <InfoTitle>ОТМЕНЕН</InfoTitle>
            <InfoValue>{<BiMinusCircle color="red" />}</InfoValue>
          </ColumnInfo>
        ) : orderItem.finished_date ? (
          <ColumnInfo>
            <InfoTitle>ЗАВЕРШЕН</InfoTitle>
            <InfoValue>
              <BiCheckCircle color="green" />
            </InfoValue>
          </ColumnInfo>
        ) : (
          <ColumnInfo>
            <InfoTitle>ОЖИДАЕТ</InfoTitle>
            <InfoValue>
              <BiStopwatch color="orange" />
            </InfoValue>
          </ColumnInfo>
        )}
      </InfoRow>
    </OrderContainer>
  );
}

export default Order;

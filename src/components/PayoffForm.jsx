import { useState, useMemo, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import TableLayout from "./TableLayout";
import MyInput from "./MyInput";
import MyTextarea from "./MyTextarea";
import config from "../config/config.json";
import styled from "styled-components";
import { finishDeliveries } from "../api/DeliveriesApi";

const { CURRENCIES, DELIVERY_DIRECTIONS, DELIVERY_STATUSES } = config;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 5px;
  }
`;
const TotalSum = styled.p`
  font-size: 18px;
`;
const TotalTitle = styled.p`
  font-size: 13px;
  color: #5a5a5a;
  margin-top: 15px;
`;

function PayOffForm({
  isLoading,
  setIsLoading,
  deliveries = [],
  next,
  setModal,
}) {
  const { token, currency } = useAuth();
  const [comment, setComment] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState({});

  useEffect(() => {
    const temp = {};
    deliveries.forEach(
      (item) => (temp[item.id] = item.delivery_price_for_deliver)
    );
    setDeliveryPrices(temp);
  }, [deliveries]);

  const handleDeliveryPricesChange = useCallback((v, id) => {
    setDeliveryPrices((prev) => {
      const temp = { ...prev };
      temp[id] = v;
      return temp;
    });
  }, []);

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
          fixedMinWidth: "90px",
          fixedJustWidth: "90px",
          fixedMaxWidth: "90px",
        },
        title: "НАПРАВЛЕНИЕ",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
      {
        id: "goods",
        style: {
          fixedMinWidth: "120px",
          fixedJustWidth: "120px",
          fixedMaxWidth: "120px",
        },
        title: "ТОВАРЫ",
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
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "ПЛАТА ЗА ДОСТАВКУ",
        type: "other",
        dataStyle: { dataAlign: "center" },
        children: ({ dataItem }) => (
          <InputWrapper>
            <MyInput
              fontSize={11}
              value={
                deliveryPrices[dataItem.id] ? deliveryPrices[dataItem.id] : ""
              }
              onChange={(e) =>
                handleDeliveryPricesChange(e.target.value, dataItem.id)
              }
              disabled={isLoading}
              inputMode="numeric"
              integer={true}
              unsigned={true}
              max={999999}
            />
            <p>{" " + CURRENCIES[currency]}</p>
          </InputWrapper>
        ),
      },
      {
        id: "sum",
        style: {
          fixedMinWidth: "100px",
          fixedJustWidth: "100px",
          fixedMaxWidth: "100px",
        },
        title: "ПРИНЯТАЯ ОПЛАТА",
        dataStyle: { dataAlign: "center" },
        type: "text",
      },
    ],
    [currency, deliveryPrices, handleDeliveryPricesChange, isLoading]
  );
  const dataForTable = useMemo(
    () =>
      deliveries.map((item, index) => {
        let total = 0;
        if (item.orderInfo && item.archiveOrderInfo) {
          item.orderInfo.payments.forEach(
            (payment) => (total += payment.amount)
          );
          item.archiveOrderInfo.payments.forEach(
            (payment) => (total += payment.amount)
          );
        }
        const goods = {};
        if (item.orderInfo?.orderGoods) {
          for (let orderGood of item.orderInfo.orderGoods) {
            if (goods[orderGood.good.id]) {
              goods[orderGood.good.id]["quantity"]++;
              continue;
            }
            goods[orderGood.good.id] = {
              id: orderGood.good.id,
              quantity: 1,
              name: orderGood.good.name,
            };
          }
        }
        if (item.archiveOrderInfo?.orderGoods) {
          for (let orderGood of item.archiveOrderInfo.orderGoods) {
            if (goods[orderGood.good.id]) {
              goods[orderGood.good.id]["quantity"]++;
              continue;
            }
            goods[orderGood.good.id] = {
              id: orderGood.good.id,
              quantity: 1,
              name: orderGood.good.name,
            };
          }
        }
        return {
          id: item.id,
          index: index + 1,
          address: item.address,
          status: item.cancelled
            ? "ОТМЕНЕН"
            : DELIVERY_STATUSES[item.status]?.toUpperCase(),
          direction: DELIVERY_DIRECTIONS[item.direction].toUpperCase(),
          delivery_price_for_deliver: item.delivery_price_for_deliver,
          sum: total + ` ${CURRENCIES[currency]}`,
          goods: Object.values(goods)
            .map((good) => `${good.quantity} шт. ${good.name}`)
            .join("; "),
        };
      }),
    [deliveries, currency]
  );
  const paySum = useMemo(() => {
    const result = { total: 0 };
    for (let delivery of deliveries) {
      delivery?.payments.forEach((payment) => {
        result.total += payment.amount;
        if (result[payment.type]) {
          return (result[payment.type] += payment.amount);
        }
        result[payment.type] = payment.amount;
      });
    }
    return Object.keys(result).map((key) => ({
      type: key,
      amount: result[key],
    }));
  }, [deliveries]);
  const goodsToReturn = useMemo(() => {
    const goods = [];
    for (let delivery of deliveries) {
      delivery.orderInfo?.orderGoods.forEach((orderGood) => {
        for (let good of goods) {
          if (good === orderGood.specie.id) {
            break;
          }
        }
        goods.push({
          specieId: orderGood.specie.id,
          specieCode: orderGood.specie.code,
        });
      });
      delivery.archiveOrderInfo?.orderGoods.forEach((orderGood) => {
        for (let good of goods) {
          if (good === orderGood.specie.id) {
            break;
          }
        }
        goods.push({
          specieId: orderGood.specie.id,
          specieCode: orderGood.specie.code,
        });
      });
    }
    return goods;
  }, [deliveries]);
  const buttons = useMemo(
    () => [
      {
        id: 0,
        text: "Нет",
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          setModal(false);
        },
      },
      {
        id: 1,
        text: "Да",
        type: "submit",
        loading: isLoading,
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          finishDeliveries(
            setIsLoading,
            token,
            Object.keys(deliveryPrices).map((key) => ({
              delivery_id: parseInt(key),
              delivery_price_for_deliver: parseInt(deliveryPrices[key]),
            })),
            comment,
            next()
          );
        },
      },
    ],
    [next, token, isLoading, setIsLoading, setModal, deliveryPrices, comment]
  );

  return (
    <FormLayout
      mobileMaxWidth="100%"
      firstHalf={
        <div>
          <TableLayout headers={headers} fontSize={11} data={dataForTable} />
          <MyTextarea
            label="Заметка"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
          />
          <TotalTitle>Курьер должен отдать деньги: </TotalTitle>
          {paySum.map((item) => {
            if (item.type === "total") {
              return (
                <TotalSum key={item.type}>
                  Общая сумма: {item.amount} {CURRENCIES[currency]}
                </TotalSum>
              );
            }
            return (
              <p key={item.type}>
                {item.type}: {item.amount} {CURRENCIES[currency]}
              </p>
            );
          })}
          <TotalTitle>Курьер должен отдать товары: </TotalTitle>
          {goodsToReturn.map((good, index) => (
            <p key={good.specieId}>
              {index + 1}. {String(good.specieCode).padStart(10, "0")}
            </p>
          ))}
        </div>
      }
      buttons={buttons}
    />
  );
}

export default PayOffForm;

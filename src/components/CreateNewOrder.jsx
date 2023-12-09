import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import GoodPicker from "./GoodPicker";
import ClientPicker from "./ClientPicker";
import DatePicker from "./DatePicker";
import MyInput from "./MyInput";
import Select from "./Select";
import moment from "moment";
import config from "../config/config.json";
import MyTextarea from "./MyTextarea";
import MyButton from "./MyButton";
import useAuth from "../hooks/useAuth";
import { createNewOrder } from "../api/OrderApi";

const {
  DEFAULT_TARIFF_VALUE,
  DEFAULT_FORGIVELATENESS_VALUE,
  TARIFFS,
  TARIFF_UNITS,
  CURRENCIES,
  TARIFF_KEYS,
  TARIFF_MOMENT_KEYS,
  FORGIVE_LATENESS_UNITS_S,
} = config;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  height: 80vh;
  max-width: 850px;
`;
const InputsContainer = styled.div`
  flex-direction: column;
  padding-right: 5px;
  display: flex;
  overflow-y: auto;
`;
const StepTitle = styled.p`
  font-size: 19px;
  text-align: center;
  font-weight: 600;
  margin: 10px 0 5px 0;
  user-select: none;
`;
const SignContractWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;
const SignContractHalf = styled.div`
  width: 48%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const SignContractRow = styled.div`
  display: flex;
  width: 100%;
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;
const TotalInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const TotalRow = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 600px) {
    ${(props) => props.style?.isPlanDate && "display: none;"}
  }
`;
const TotalTitle = styled.p`
  user-select: none;
  max-width: 50px;
  margin-right: 5px;
  color: #909090;
  font-size: ${(props) =>
    props.style?.titleFontSize ? props.style.titleFontSize + "px" : "10px"};
`;
const TotalValue = styled.p`
  font-size: ${(props) =>
    props.style?.valueFontSize ? props.style.valueFontSize + "px" : "15px"};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
  color: ${(props) => props.style?.textColor};
`;
const DeliveryWrapper = styled.div`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  margin-top: 5px;
`;
const DeliveryButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #ffd700;
  margin: 5px 0 10px 0;
  justify-content: center;
  ${(props) =>
    props.style?.delete
      ? "margin-bottom: 30px; border-radius: 0; border: none; "
      : "height: 200px"};
`;
const DeliveryTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin: 7px 0 4px 0;
  user-select: none;
`;

function CreateNewOrder({
  setCreateOrderModal,
  createNewOrderLoading,
  setCreateNewOrderLoading,
}) {
  const { currency, token } = useAuth();
  const [pickedGoods, setPickedGoods] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientInfo, setSelectedClientInfo] = useState({});
  const [startDate, setStartDate] = useState(moment());
  const [tariff, setTariff] = useState(
    localStorage.getItem("tariff")
      ? localStorage.getItem("tariff")
      : DEFAULT_TARIFF_VALUE
  );
  const [renttime, setRenttime] = useState(0);
  const [forgiveLatenessUnit, setForgiveLatenessUnit] = useState(
    localStorage.getItem("forgiveLatenessUnit")
      ? localStorage.getItem("forgiveLatenessUnit")
      : DEFAULT_FORGIVELATENESS_VALUE
  );
  const [forgiveLateness, setForgiveLateness] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState("");
  const [discountType, setDiscountType] = useState(0);
  const [comment, setComment] = useState("");
  const [deliveryThereEnable, setDeliveryThereEnable] = useState(false);
  const [deliveryHereEnable, setDeliveryHereEnable] = useState(false);
  const [deliveryThere, setDeliveryThere] = useState([
    { id: "address", value: "", title: "Адрес доставки" },
    { id: "cellphone", value: "", title: "Номер телефона" },
    {
      id: "delivery_price_for_deliver",
      value: "0",
      title: "Стоимость доставки для курьера",
      type: "price",
    },
    {
      id: "delivery_price_for_customer",
      value: "0",
      title: "Стоимость доставки для клиента",
      type: "price",
    },
    { id: "comment", value: "", title: "Комментарий", type: "textarea" },
  ]);
  const [deliveryHere, setDeliveryHere] = useState([
    { id: "address", value: "", title: "Адрес доставки" },
    { id: "cellphone", value: "", title: "Номер телефона" },
    {
      id: "delivery_price_for_deliver",
      value: "0",
      title: "Стоимость доставки для курьера",
      type: "price",
    },
    {
      id: "delivery_price_for_customer",
      value: "0",
      title: "Стоимость доставки для клиента",
      type: "price",
    },
    { id: "comment", value: "", title: "Комментарий", type: "textarea" },
  ]);

  const tariffOptions = useMemo(() => {
    try {
      return Object.keys(TARIFFS).map((key) => ({
        id: key,
        name: TARIFFS[key],
      }));
    } catch {
      return [];
    }
  }, []);
  const unitOptions = useMemo(() => {
    try {
      return Object.keys(TARIFF_UNITS).map((key) => ({
        id: key,
        name: TARIFF_UNITS[key],
      }));
    } catch {
      return [];
    }
  }, []);
  const totals = useMemo(() => {
    let total = 0;
    let totalDeliveryCost = 0;
    pickedGoods.forEach((item) => {
      const price = item.good?.[TARIFF_KEYS?.[tariff]];
      total += price ? price : 0;
    });
    if (deliveryHereEnable) {
      for (let item of deliveryHere) {
        if (item.id === "delivery_price_for_customer") {
          totalDeliveryCost += parseInt(item.value);
          break;
        }
      }
    }
    if (deliveryThereEnable) {
      for (let item of deliveryThere) {
        if (item.id === "delivery_price_for_customer") {
          totalDeliveryCost += parseInt(item.value);
          break;
        }
      }
    }
    total = renttime * total + totalDeliveryCost;
    const discountSum = discountType ? (total * discount) / 100 : discount;
    const totalWithDiscount = total - discountSum;
    return {
      total: { title: "Сумма:", value: total },
      discountSum: { title: "Скидка:", value: discountSum },
      totalWithDiscount: {
        title: "Сумма со скидкой:",
        value: totalWithDiscount,
        valueFontSize: 22,
      },
    };
  }, [
    pickedGoods,
    discount,
    discountType,
    renttime,
    tariff,
    deliveryHere,
    deliveryThere,
    deliveryHereEnable,
    deliveryThereEnable,
  ]);

  const plannedDate = useMemo(() => {
    const date = moment(startDate).add(renttime, TARIFF_MOMENT_KEYS[tariff]);
    if (date.isValid()) {
      if (date.isSame(moment(startDate))) {
        return "-";
      }
      return date.format("DD.MM.yyyyг. HH:mm");
    }
    return "-";
  }, [startDate, renttime, tariff]);

  const handleChangeDeliveryThere = useCallback((id, v) => {
    setDeliveryThere((p) => {
      const temp = [...p];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
        }
      }
      return temp;
    });
  }, []);
  const handleChangeDeliveryHere = useCallback((id, v) => {
    setDeliveryHere((p) => {
      const temp = [...p];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
        }
      }
      return temp;
    });
  }, []);
  const handleSaveButton = useCallback(() => {
    if (!token) {
      return;
    }
    const data = {};
    if (deliveryThereEnable) {
      const deliveryThereObj = {};
      deliveryThere.forEach((item) => (deliveryThereObj[item.id] = item.value));
      data.deliveryThere = deliveryThereObj;
    }
    if (deliveryHereEnable) {
      const deliveryHereObj = {};
      deliveryHere.forEach((item) => (deliveryHereObj[item.id] = item.value));
      data.deliveryHere = deliveryHereObj;
    }
    if (comment) {
      data.comment = comment;
    }
    if (discountReason) {
      data.discountReason = discountReason;
    }
    if (pickedGoods.length > 0) {
      data.goods = pickedGoods.map((item) => ({ id: item.specie.id }));
    }
    data.client = selectedClient.id;
    data.renttime = parseInt(renttime);
    data.forgive_lateness_ms =
      forgiveLateness * FORGIVE_LATENESS_UNITS_S[forgiveLatenessUnit] * 1000;
    data.started_date = moment(startDate).toDate();
    data.discount = totals.discountSum.value;
    data.tariff = tariff;
    createNewOrder(setCreateNewOrderLoading, token, data, () => {
      setCreateOrderModal(false);
    });
  }, [
    comment,
    deliveryHere,
    deliveryHereEnable,
    deliveryThere,
    deliveryThereEnable,
    forgiveLateness,
    forgiveLatenessUnit,
    pickedGoods,
    renttime,
    selectedClient,
    startDate,
    tariff,
    totals,
    setCreateNewOrderLoading,
    setCreateOrderModal,
    token,
    discountReason,
  ]);

  useEffect(() => {
    const address = selectedClientInfo?.address;
    const cellphone = selectedClientInfo?.cellphone;
    if (address) {
      handleChangeDeliveryThere("address", address);
      handleChangeDeliveryHere("address", address);
    }
    if (cellphone) {
      handleChangeDeliveryThere("cellphone", cellphone);
      handleChangeDeliveryHere("cellphone", cellphone);
    }
  }, [selectedClientInfo, handleChangeDeliveryHere, handleChangeDeliveryThere]);

  return (
    <MainWrapper>
      <InputsContainer>
        <StepTitle>1. ВЫБЕРИТЕ ТОВАРЫ</StepTitle>
        <GoodPicker
          disabled={createNewOrderLoading}
          tariff={tariff}
          pickedGoods={pickedGoods}
          setPickedGoods={setPickedGoods}
        />
        <StepTitle>2. ВЫБЕРИТЕ КЛИЕНТА</StepTitle>
        <ClientPicker
          disabled={createNewOrderLoading}
          selectedClientInfo={selectedClientInfo}
          setSelectedClientInfo={setSelectedClientInfo}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
        <StepTitle>3. ЗАКЛЮЧИТЕ ДОГОВОР</StepTitle>
        <SignContractWrapper>
          <SignContractHalf>
            <DatePicker
              disabled={createNewOrderLoading}
              selectedDate={startDate}
              handleDateChange={setStartDate}
              label="Дата старта"
            />
          </SignContractHalf>
          <SignContractHalf>
            <Select
              options={tariffOptions}
              loading={createNewOrderLoading}
              setValue={(v) => {
                localStorage.setItem("tariff", v);
                setTariff(v);
              }}
              value={tariff}
              label="Тариф"
            />
            <MyInput
              disabled={createNewOrderLoading}
              integer={true}
              max={99999}
              unsigned={true}
              value={renttime}
              onChange={(e) => setRenttime(e.target.value)}
              label={`Срок аренды (${TARIFF_UNITS[tariff]})`}
            />
            <SignContractRow>
              <MyInput
                disabled={createNewOrderLoading}
                integer={true}
                unsigned={true}
                value={forgiveLateness}
                onChange={(e) => setForgiveLateness(e.target.value)}
                label="Простить опоздание"
              />
              <Select
                selectWidth="40%"
                options={unitOptions}
                loading={createNewOrderLoading}
                setValue={(v) => {
                  localStorage.setItem("forgiveLatenessUnit", v);
                  setForgiveLatenessUnit(v);
                }}
                value={forgiveLatenessUnit}
                label="Ед. изм."
              />
            </SignContractRow>
            <SignContractRow>
              <MyInput
                disabled={createNewOrderLoading}
                integer={true}
                unsigned={true}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                label="Скидка"
              />
              <Select
                selectWidth="40%"
                options={[
                  { id: 0, name: CURRENCIES[currency] },
                  { id: 1, name: "%" },
                ]}
                loading={createNewOrderLoading}
                setValue={setDiscountType}
                value={discountType}
                label="Тип"
              />
            </SignContractRow>
            <MyTextarea
              disabled={createNewOrderLoading}
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              label="Причина скидки"
              max={150}
            />
          </SignContractHalf>
        </SignContractWrapper>
        <MyTextarea
          disabled={createNewOrderLoading}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          label="Заметка"
          max={500}
        />
        <StepTitle>4. ОФОРМИТЕ ДОСТАВКУ (ОПЦИОНАЛЬНО)</StepTitle>
        <SignContractWrapper>
          <SignContractHalf>
            {deliveryThereEnable ? (
              <DeliveryWrapper>
                <DeliveryTitle>Доставка к клиенту</DeliveryTitle>
                {deliveryThere.map((item) => {
                  if (item.type) {
                    if (item.type === "textarea") {
                      return (
                        <MyTextarea
                          key={item.id}
                          label={item.title}
                          value={item.value}
                          disabled={createNewOrderLoading}
                          onChange={(e) =>
                            handleChangeDeliveryThere(item.id, e.target.value)
                          }
                        />
                      );
                    }
                    if (item.type === "price") {
                      return (
                        <MyInput
                          key={item.id}
                          label={item.title}
                          value={item.value}
                          integer={true}
                          unsigned={true}
                          disabled={createNewOrderLoading}
                          onChange={(e) =>
                            handleChangeDeliveryThere(item.id, e.target.value)
                          }
                        />
                      );
                    }
                  }
                  return (
                    <MyInput
                      key={item.id}
                      label={item.title}
                      value={item.value}
                      disabled={createNewOrderLoading}
                      onChange={(e) =>
                        handleChangeDeliveryThere(item.id, e.target.value)
                      }
                    />
                  );
                })}
                <DeliveryButtonWrapper style={{ delete: true }}>
                  <MyButton
                    disabled={createNewOrderLoading}
                    margin="0"
                    text="Удалить доставку"
                    onClick={() => setDeliveryThereEnable(false)}
                  />
                </DeliveryButtonWrapper>
              </DeliveryWrapper>
            ) : (
              <DeliveryButtonWrapper>
                <MyButton
                  disabled={createNewOrderLoading}
                  margin="0"
                  text="Добавить доставку к клиенту"
                  onClick={() => setDeliveryThereEnable(true)}
                />
              </DeliveryButtonWrapper>
            )}
          </SignContractHalf>
          <SignContractHalf>
            {deliveryHereEnable ? (
              <DeliveryWrapper>
                <DeliveryTitle>Доставка от клиента</DeliveryTitle>
                {deliveryHere.map((item) => {
                  if (item.type) {
                    if (item.type === "textarea") {
                      return (
                        <MyTextarea
                          key={item.id}
                          label={item.title}
                          value={item.value}
                          disabled={createNewOrderLoading}
                          onChange={(e) =>
                            handleChangeDeliveryHere(item.id, e.target.value)
                          }
                        />
                      );
                    }
                    if (item.type === "price") {
                      return (
                        <MyInput
                          key={item.id}
                          label={item.title}
                          value={item.value}
                          integer={true}
                          unsigned={true}
                          disabled={createNewOrderLoading}
                          onChange={(e) =>
                            handleChangeDeliveryHere(item.id, e.target.value)
                          }
                        />
                      );
                    }
                  }
                  return (
                    <MyInput
                      key={item.id}
                      label={item.title}
                      value={item.value}
                      disabled={createNewOrderLoading}
                      onChange={(e) =>
                        handleChangeDeliveryHere(item.id, e.target.value)
                      }
                    />
                  );
                })}
                <DeliveryButtonWrapper style={{ delete: true }}>
                  <MyButton
                    disabled={createNewOrderLoading}
                    margin="0"
                    text="Удалить доставку"
                    onClick={() => setDeliveryHereEnable(false)}
                  />
                </DeliveryButtonWrapper>
              </DeliveryWrapper>
            ) : (
              <DeliveryButtonWrapper>
                <MyButton
                  disabled={createNewOrderLoading}
                  margin="0"
                  text="Добавить доставку от клиента"
                  onClick={() => setDeliveryHereEnable(true)}
                />
              </DeliveryButtonWrapper>
            )}
          </SignContractHalf>
        </SignContractWrapper>
      </InputsContainer>
      <ButtonsContainer>
        <TotalInfoWrapper>
          {Object.keys(totals).map((key) => (
            <TotalRow key={key}>
              <TotalTitle style={{ titleFontSize: totals[key].titleFontSize }}>
                {totals[key].title}
              </TotalTitle>
              <TotalValue style={{ valueFontSize: totals[key].valueFontSize }}>
                {totals[key].value}
                {CURRENCIES[currency]}
              </TotalValue>
            </TotalRow>
          ))}
        </TotalInfoWrapper>
        <TotalInfoWrapper>
          <TotalRow style={{ isPlanDate: true }}>
            <TotalTitle>План. дата конца аренды:</TotalTitle>
            <TotalValue>{plannedDate}</TotalValue>
          </TotalRow>
        </TotalInfoWrapper>
        <MyButton
          margin="0"
          disabled={createNewOrderLoading}
          loading={String(createNewOrderLoading)}
          text="Сохранить"
          onClick={handleSaveButton}
        />
      </ButtonsContainer>
    </MainWrapper>
  );
}

export default CreateNewOrder;

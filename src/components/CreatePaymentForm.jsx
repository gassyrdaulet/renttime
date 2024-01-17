import { useState, useCallback, useMemo, useEffect } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import styled from "styled-components";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import Switch from "./Switch";
import { getMethods } from "../api/OrganizationApi";
import { newPayment } from "../api/OrderApi";
import moment from "moment";
import DateTimePicker from "./DateTimePicker";

const CreatePaymentFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreatePaymentFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreatePaymentInputContainers = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  width: 100%;
  @media (max-width: 800px) {
    max-width: 300px;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;

function CreatePaymentForm({
  createPaymentLoading,
  setCreatePaymentLoading,
  orderId,
  next,
}) {
  const [inputs, setInputs] = useState([
    {
      id: 0,
      title: "Сумма",
      value: "0",
      name: "amount",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
  ]);
  const { token } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 0, name: "Загрузка..." },
  ]);
  const [paymentMethod, setPaymentMethod] = useState();
  // const [isDebt, setIsDebt] = useState(false);
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);

  useEffect(() => {
    getMethods(setCreatePaymentLoading, token, setPaymentMethods);
  }, [token, setCreatePaymentLoading]);

  const options = useMemo(() => {
    const result = paymentMethods.map((item) => ({
      id: item.id,
      name: item.name + (item.comission ? ` (${item.comission}%)` : ""),
    }));
    if (result.length !== 0) {
      setPaymentMethod(result[0].id);
    }
    return result;
  }, [paymentMethods]);

  const handleInputChange = useCallback((id, value) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = value;
          break;
        }
      }
      return temp;
    });
  }, []);

  return (
    <CreatePaymentFormWrapper>
      <CreatePaymentFormContainer>
        <CreatePaymentInputContainers>
          <InputsContainer>
            {inputs.map((item) => (
              <MyInput
                onChange={(e) => {
                  handleInputChange(item.id, e.target.value);
                }}
                label={item.title}
                key={item.id}
                value={item.value}
                disabled={createPaymentLoading}
                inputMode={item.inputMode}
                integer={item.integer}
                unsigned={item.unsigned}
                zerofill={item.zerofill}
              />
            ))}
            <Select
              label="Способ оплаты"
              value={paymentMethod}
              setValue={setPaymentMethod}
              loading={createPaymentLoading}
              defaultOptions={[]}
              options={options}
            />
            {/* <Switch
              disabled={createPaymentLoading}
              label="В долг"
              isChecked={isDebt}
              setChecked={setIsDebt}
            /> */}
            <Switch
              disabled={createPaymentLoading}
              label="Своя дата"
              isChecked={ownDate}
              setChecked={setOwnDate}
            />
            {ownDate && (
              <DateTimePicker
                disabled={createPaymentLoading}
                label="Дата платежа"
                dateTime={date}
                setDateTime={setDate}
              />
            )}
          </InputsContainer>
        </CreatePaymentInputContainers>
      </CreatePaymentFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createPaymentLoading.toString()}
          disabled={createPaymentLoading}
          text="Добавить"
          onClick={(e) => {
            e.preventDefault();
            const data = {};
            inputs.forEach((item) => {
              data[item.name] = item.value;
            });
            if (ownDate) {
              data.date = moment(date).toDate();
            }
            newPayment(
              setCreatePaymentLoading,
              token,
              orderId,
              {
                ...data,
                // is_debt: isDebt,
                payment_method_id: paymentMethod,
              },
              next
            );
          }}
        />
      </ButtonsContainer>
    </CreatePaymentFormWrapper>
  );
}

export default CreatePaymentForm;

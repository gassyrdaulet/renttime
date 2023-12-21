import { useState, useCallback } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import Switch from "./Switch";
import { newDiscount } from "../api/OrderApi";
import moment from "moment";
import DatePicker from "./DatePicker";
import MyTextarea from "./MyTextarea";

const CreateDiscountFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreateDiscountFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateDiscountInputContainers = styled.div`
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

function CreateDiscountForm({
  createDiscountLoading,
  setCreateDiscountLoading,
  orderId,
  next,
}) {
  const [inputs, setInputs] = useState([
    {
      id: 0,
      title: `Сумма`,
      value: "0",
      name: "amount",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
  ]);
  const { token } = useAuth();
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);
  const [reason, setReason] = useState("");

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
    <CreateDiscountFormWrapper>
      <CreateDiscountFormContainer>
        <CreateDiscountInputContainers>
          <InputsContainer>
            {inputs.map((item) => (
              <MyInput
                onChange={(e) => {
                  handleInputChange(item.id, e.target.value);
                }}
                label={item.title}
                key={item.id}
                value={item.value}
                disabled={createDiscountLoading}
                inputMode={item.inputMode}
                integer={item.integer}
                unsigned={item.unsigned}
                zerofill={item.zerofill}
              />
            ))}
            <MyTextarea
              placeholder="Без причины"
              label="Причина"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={createDiscountLoading}
              max={150}
            />
            <Switch
              disabled={createDiscountLoading}
              label="Своя дата"
              isChecked={ownDate}
              setChecked={setOwnDate}
            />
            {ownDate && (
              <DatePicker
                disabled={createDiscountLoading}
                label="Дата продления"
                selectedDate={date}
                handleDateChange={setDate}
                timeFormat="HH:mm"
              />
            )}
          </InputsContainer>
        </CreateDiscountInputContainers>
      </CreateDiscountFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createDiscountLoading.toString()}
          disabled={createDiscountLoading}
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
            if (reason) {
              data.reason = reason;
            }
            newDiscount(setCreateDiscountLoading, token, orderId, data, next);
          }}
        />
      </ButtonsContainer>
    </CreateDiscountFormWrapper>
  );
}

export default CreateDiscountForm;

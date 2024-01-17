import { useState, useCallback } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import Switch from "./Switch";
import { newExtension } from "../api/OrderApi";
import moment from "moment";
import DateTimePicker from "./DateTimePicker";
import config from "../config/config.json";

const { TARIFF_UNITS_2 } = config;

const CreateExtensionFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreateExtensionFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateExtensionInputContainers = styled.div`
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

function CreateExtensionForm({
  createExtensionLoading,
  setCreateExtensionLoading,
  orderId,
  next,
  tariff,
}) {
  const [inputs, setInputs] = useState([
    {
      id: 0,
      title: `Срок (${TARIFF_UNITS_2[tariff]})`,
      value: "0",
      name: "renttime",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
    },
  ]);
  const { token } = useAuth();
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);

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
    <CreateExtensionFormWrapper>
      <CreateExtensionFormContainer>
        <CreateExtensionInputContainers>
          <InputsContainer>
            {inputs.map((item) => (
              <MyInput
                onChange={(e) => {
                  handleInputChange(item.id, e.target.value);
                }}
                label={item.title}
                key={item.id}
                value={item.value}
                disabled={createExtensionLoading}
                inputMode={item.inputMode}
                integer={item.integer}
                unsigned={item.unsigned}
                zerofill={item.zerofill}
              />
            ))}
            <Switch
              disabled={createExtensionLoading}
              label="Своя дата"
              isChecked={ownDate}
              setChecked={setOwnDate}
            />
            {ownDate && (
              <DateTimePicker
                disabled={createExtensionLoading}
                label="Дата продления"
                dateTime={date}
                setDateTime={setDate}
              />
            )}
          </InputsContainer>
        </CreateExtensionInputContainers>
      </CreateExtensionFormContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          loading={createExtensionLoading.toString()}
          disabled={createExtensionLoading}
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
            newExtension(setCreateExtensionLoading, token, orderId, data, next);
          }}
        />
      </ButtonsContainer>
    </CreateExtensionFormWrapper>
  );
}

export default CreateExtensionForm;

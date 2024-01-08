import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import Select from "./Select";
import DatePicker from "./DatePicker";
import { createNewClientKZ } from "../api/ClientApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import moment from "moment";

const { GENDERS, PAPER_AUTHORITY } = config;

const CreateNewClientWrapper = styled.form`
  width: 85vw;
  max-width: 550px;
  height: 70vh;
`;
const InputsContainer = styled.div`
  overflow-y: auto;
  padding-right: 5px;
  height: 90%;
  border-bottom: 1px solid gray;
`;
const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`;

function CreateNewClient({ next = () => {}, isLoading, setIsLoading }) {
  const { token } = useAuth();
  const authorityOptions = useMemo(() => {
    try {
      return Object.keys(PAPER_AUTHORITY).map((key) => ({
        id: key,
        name: PAPER_AUTHORITY[key],
      }));
    } catch {
      return [];
    }
  }, []);
  const genderOptions = useMemo(() => {
    try {
      return Object.keys(GENDERS).map((key) => ({
        id: key,
        name: GENDERS[key],
      }));
    } catch {
      return [];
    }
  }, []);

  const [inputs, setInputs] = useState([
    { id: "paper_person_id", title: "ИИН *", value: "" },
    { id: "paper_serial_number", title: "Номер документа *", value: "" },
    {
      id: "paper_authority",
      title: "Выдано *",
      value: "mvdrk",
      type: "select",
      options: authorityOptions,
    },
    { id: "cellphone", title: "Номер телефона *", value: "" },
    { id: "second_name", title: "Фамилия *", value: "" },
    { id: "name", title: "Имя *", value: "" },
    { id: "father_name", title: "Отчество", value: "" },
    { id: "born_region", title: "Место рождения *", value: "" },
    { id: "nationality", title: "Национальность *", value: "" },
    { id: "city", title: "Город *", value: "" },
    { id: "address", title: "Район и адрес *", value: "" },
    {
      id: "paper_givendate",
      title: "Дата выдачи документа *",
      value: moment().startOf("day"),
      type: "date",
    },
    {
      id: "gender",
      title: "Пол",
      value: "undefined",
      type: "select",
      options: genderOptions,
    },
    { id: "email", title: "Эл. почта", value: "" },
  ]);

  const handleChangeInputs = useCallback((id, v) => {
    setInputs((prev) => {
      const temp = [...prev];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
        }
      }
      return temp;
    });
  }, []);

  return (
    <CreateNewClientWrapper>
      <InputsContainer>
        {inputs.map((item) => {
          if (item.type) {
            if (item.type === "select") {
              return (
                <Select
                  key={item.id}
                  label={item.title}
                  options={item.options}
                  value={item.value}
                  setValue={(v) => handleChangeInputs(item.id, v)}
                />
              );
            }
            if (item.type === "date") {
              return (
                <DatePicker
                  selectedDate={item.value}
                  handleDateChange={(v) => handleChangeInputs(item.id, v)}
                  timeFormat={false}
                  key={item.id}
                  label={item.title}
                />
              );
            }
          }
          return (
            <MyInput
              value={item.value}
              onChange={(e) => handleChangeInputs(item.id, e.target.value)}
              key={item.id}
              label={item.title}
            />
          );
        })}
      </InputsContainer>
      <ButtonsContainer>
        <MyButton
          type="submit"
          text="Сохранить"
          disabled={isLoading}
          loading={String(isLoading)}
          onClick={() => {
            const data = {};
            inputs.forEach((item) => {
              if (item.type === "date") {
                return (data[item.id] = moment(item.value).toDate());
              }
              if (item.value) data[item.id] = item.value;
            });
            createNewClientKZ(setIsLoading, token, data, next);
          }}
        />
      </ButtonsContainer>
    </CreateNewClientWrapper>
  );
}
export default CreateNewClient;

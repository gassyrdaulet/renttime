import { useState, useMemo, useCallback, useEffect } from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import Select from "./Select";
import DatePicker from "./DatePicker";
import { editClientKZ, getClientByIdKZ } from "../api/ClientApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import moment from "moment";
import FormLayout from "./FormLayout";

const { GENDERS, PAPER_AUTHORITY } = config;

function EditClientForm({
  isLoading,
  setIsLoading,
  clientId,
  next = () => {},
}) {
  const { token } = useAuth();
  const [clientInfo, setClientInfo] = useState({});
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

  useEffect(() => {
    getClientByIdKZ(setIsLoading, token, setClientInfo, clientId);
  }, [clientId, setIsLoading, token]);

  useEffect(() => {
    setInputs((prev) => {
      const temp = [...prev];
      temp.forEach((item) => {
        if (item.id === "paper_givendate") {
          return (item.value = moment(clientInfo?.[item.id])).startOf("day");
        }
        item.value = clientInfo?.[item.id] ? clientInfo[item.id] : "";
      });
      return temp;
    });
  }, [clientInfo]);

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
    <FormLayout
      firstHalf={
        <div>
          {inputs.map((item) => {
            if (item.type) {
              if (item.type === "select") {
                return (
                  <Select
                    disabled={isLoading}
                    loading={isLoading}
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
                    disabled={isLoading}
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
                disabled={isLoading}
                value={item.value}
                onChange={(e) => handleChangeInputs(item.id, e.target.value)}
                key={item.id}
                label={item.title}
              />
            );
          })}
          <MyButton
            type="submit"
            text="Сохранить"
            disabled={isLoading}
            loading={String(isLoading)}
            onClick={(e) => {
              e.preventDefault();
              const data = {};
              inputs.forEach((item) => {
                if (item.type === "date") {
                  return (data[item.id] = moment(item.value).toDate());
                }
                if (item.value) data[item.id] = item.value;
              });
              data.client_id = clientId;
              editClientKZ(setIsLoading, token, data, next);
            }}
          />
        </div>
      }
    />
  );
}
export default EditClientForm;

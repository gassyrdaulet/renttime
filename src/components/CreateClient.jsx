import { useMemo } from "react";
import { createNewClientKZ } from "../api/ClientApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import InputsLayout from "./InputsLayout";

const { GENDERS, PAPER_AUTHORITY } = config;

function CreateNewClient({ next = () => {}, isLoading, setIsLoading }) {
  const { token, orgData } = useAuth();
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

  const inputs = useMemo(() => {
    return [
      [
        [
          [
            {
              id: "paper_person_id",
              type: "text",
              value: "",
              label: "ИИН *",
            },
          ],
          [
            {
              id: "paper_serial_number",
              type: "text",
              value: "",
              label: "Номер документа *",
            },
          ],
          [
            {
              id: "paper_authority",
              type: "select",
              options: authorityOptions,
              value: "undefined",
              label: "Выдано",
            },
          ],
          [
            {
              id: "cellphone",
              type: "text",
              value: "",
              label: "Номер телефона *",
            },
          ],
          [
            {
              id: "second_name",
              type: "text",
              value: "",
              label: "Фамилия *",
            },
          ],
          [
            {
              id: "name",
              type: "text",
              value: "",
              label: "Имя *",
            },
          ],
          [
            {
              id: "father_name",
              type: "text",
              value: "",
              label: "Отчество",
            },
          ],
          [
            {
              id: "born_region",
              type: "text",
              value: "",
              label: "Место рождения",
            },
          ],
          [
            {
              id: "nationality",
              type: "text",
              value: "",
              label: "Национальность",
            },
          ],
          [
            {
              id: "city",
              type: "text",
              value: orgData?.city ? orgData.city : "",
              label: "Город",
            },
          ],
          [
            {
              id: "address",
              type: "text",
              value: "",
              label: "Район и адрес",
            },
          ],
          [
            {
              id: "paper_givendate",
              type: "date",
              value: "",
              switchLabel: "Выбрать дату выдачи документа",
              switch: true,
              label: "Дата выдачи документа",
            },
          ],
          [
            {
              id: "gender",
              type: "select",
              value: "undefined",
              label: "Пол",
              options: genderOptions,
            },
          ],
          [
            {
              id: "email",
              type: "text",
              value: "",
              label: "Адрес эл. почты",
            },
          ],
        ],
      ],
    ];
  }, [authorityOptions, genderOptions, orgData.city]);

  const buttons = useMemo(() => {
    return [
      {
        id: 1,
        text: "Сохранить",
        onClick: (data) => {
          createNewClientKZ(setIsLoading, token, data, next);
        },
      },
    ];
  }, [next, token, setIsLoading]);

  return (
    <InputsLayout inputs={inputs} disabled={isLoading} buttons={buttons} />
  );
}
export default CreateNewClient;

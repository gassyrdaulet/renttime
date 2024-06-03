import { useMemo, useState, useEffect } from "react";
import { editClientKZ, getClientByIdKZ } from "../api/ClientApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import InputsLayout from "./InputsLayout";
import moment from "moment";

const { GENDERS, PAPER_AUTHORITY } = config;

function EditClientForm({
  next = () => {},
  isLoading,
  setIsLoading,
  clientId,
}) {
  const [clientInfo, setClientInfo] = useState();
  const [clientInfoLoading, setClientInfoLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    getClientByIdKZ(setClientInfoLoading, token, setClientInfo, clientId);
  }, [clientId, token]);

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
    if (!clientInfo) {
      return [];
    }
    return [
      [
        [
          [
            {
              id: "paper_person_id",
              type: "text",
              value: clientInfo.paper_person_id,
              label: "ИИН *",
            },
          ],
          [
            {
              id: "paper_serial_number",
              type: "text",
              value: clientInfo.paper_serial_number,
              label: "Номер документа *",
            },
          ],
          [
            {
              id: "paper_authority",
              type: "select",
              options: authorityOptions,
              value: clientInfo.paper_authority
                ? clientInfo.paper_authority
                : "undefined",
              label: "Выдано",
            },
          ],
          [
            {
              id: "cellphone",
              type: "text",
              value: clientInfo.cellphone,
              label: "Номер телефона *",
            },
          ],
          [
            {
              id: "second_name",
              type: "text",
              value: clientInfo.second_name,
              label: "Фамилия *",
            },
          ],
          [
            {
              id: "name",
              type: "text",
              value: clientInfo.name,
              label: "Имя *",
            },
          ],
          [
            {
              id: "father_name",
              type: "text",
              value: clientInfo.father_name,
              label: "Отчество",
            },
          ],
          [
            {
              id: "born_region",
              type: "text",
              value: clientInfo.born_region,
              label: "Место рождения",
            },
          ],
          [
            {
              id: "nationality",
              type: "text",
              value: clientInfo.nationality,
              label: "Национальность",
            },
          ],
          [
            {
              id: "city",
              type: "text",
              value: clientInfo.city,
              label: "Город",
            },
          ],
          [
            {
              id: "address",
              type: "text",
              value: clientInfo.address,
              label: "Район и адрес",
            },
          ],
          [
            {
              id: "paper_givendate",
              type: "date",
              value: moment(clientInfo.paper_givendate).isValid()
                ? moment(clientInfo.paper_givendate).format("YYYY-MM-DD")
                : "",
              switchLabel: "Выбрать дату выдачи документа",
              switch: clientInfo.paper_givendate ? true : false,
              label: "Дата выдачи документа",
            },
          ],
          [
            {
              id: "gender",
              type: "select",
              value: clientInfo.gender ? clientInfo.gender : "undefined",
              label: "Пол",
              options: genderOptions,
            },
          ],
          [
            {
              id: "email",
              type: "text",
              value: clientInfo.email,
              label: "Адрес эл. почты",
            },
          ],
        ],
      ],
    ];
  }, [authorityOptions, genderOptions, clientInfo]);

  const buttons = useMemo(() => {
    return [
      {
        id: 1,
        text: "Сохранить",
        onClick: (data) => {
          editClientKZ(
            setIsLoading,
            token,
            { client_id: clientId, ...data },
            next
          );
        },
      },
    ];
  }, [next, token, setIsLoading, clientId]);

  return (
    <InputsLayout
      loading={clientInfoLoading}
      inputs={inputs}
      disabled={isLoading}
      buttons={buttons}
    />
  );
}

export default EditClientForm;

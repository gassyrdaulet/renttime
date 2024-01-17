import { useMemo, useState, useEffect, useCallback } from "react";
import FormLayout from "./InputsLayout";
import { editOrganization, getOrganization } from "../api/OrganizationApi";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";

const { COMPANY_TYPES } = config;

function EditOrganizationProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { token } = useAuth();

  const fetchData = useCallback(() => {
    getOrganization(setIsLoading, token, setData);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const inputs = useMemo(() => {
    if (!data) {
      return [];
    }
    return [
      [
        [
          [
            {
              id: "name",
              type: "text",
              value: data.name,
              label: "Название организации *",
            },
          ],
          [
            {
              id: "region",
              type: "select",
              value: data.region,
              options: [
                { id: "null", name: "Не выбран" },
                { id: "kz", name: "Казахстан" },
              ],
              label: "Регион *",
            },
          ],
          [
            {
              id: "city",
              type: "text",
              value: data.city,
              label: "Город *",
            },
          ],
          [
            {
              id: "address",
              type: "text",
              value: data.address,
              label: "Адрес *",
            },
          ],
          [
            {
              id: "region",
              type: "select",
              value: data.region,
              options: [
                { id: "null", name: "Не выбран" },
                { id: "kz", name: "Казахстан" },
              ],
              label: "Регион *",
            },
          ],
          [
            {
              id: "bank_company_type",
              type: "select",
              options: COMPANY_TYPES,
              value: data.bank_company_type,
              label: "Тип компании банка банка *",
            },
          ],
          [
            {
              id: "bank_company_name",
              type: "text",
              value: data.bank_company_name,
              label: "Название компании банка *",
            },
          ],
          [
            {
              id: "company_type",
              type: "select",
              options: COMPANY_TYPES,
              value: data.company_type,
              label: "Тип вашей компании *",
            },
          ],
          [
            {
              id: "company_name",
              type: "text",
              value: data.company_name,
              label: "Название вашей компании *",
            },
          ],
          [
            {
              id: "kz_paper_bin",
              type: "text",
              value: data.kz_paper_bin,
              label: "БИН *",
            },
          ],
          [
            {
              id: "kz_paper_bik",
              type: "text",
              value: data.kz_paper_bik,
              label: "БИК *",
            },
          ],
          [
            {
              id: "kz_paper_iik",
              type: "text",
              value: data.kz_paper_iik,
              label: "ИИК *",
            },
          ],
          [
            {
              id: "cancel_time_ms",
              type: "int",
              value: data.cancel_time_ms,
              label: "Время для возврата оборудования (миллисекунды) *",
            },
          ],
        ],
      ],
      [
        [
          [
            {
              id: "start_work",
              type: "time",
              value: data.start_work?.substring(0, 5),
              label: "Время открытия",
              width: "49%",
            },
            {
              id: "end_work",
              type: "time",
              value: data.end_work?.substring(0, 5),
              label: "Время закрытия",
              width: "49%",
            },
          ],
        ],
      ],
    ];
  }, [data]);

  const buttons = useMemo(() => {
    return [
      {
        id: 1,
        text: "Сохранить",
        onClick: (data) => {
          editOrganization(setIsLoading, data, token, fetchData);
        },
      },
    ];
  }, [fetchData, token]);

  return (
    <div>
      <FormLayout
        inputs={inputs}
        width="100%"
        maxWidth="100%"
        disabled={isLoading}
        height="inherit"
        maxHeight="inherit"
        buttons={buttons}
      />
    </div>
  );
}

export default EditOrganizationProfile;

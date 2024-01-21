import { useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { createDebt } from "../api/ClientApi";
import InputsLayout from "./InputsLayout";
import moment from "moment";

function CreateDebtPaymentForm({ isLoading, setIsLoading, clientId, next }) {
  const { token } = useAuth();

  const inputs = useMemo(() => {
    return [
      [
        [
          [
            {
              id: "amount",
              type: "int",
              value: "0",
              label: "Сумма *",
            },
          ],
          [
            {
              id: "comment",
              type: "textarea",
              value: "",
              label: "Комментарий",
            },
          ],
          [
            {
              switchLabel: "Своя дата",
              switch: false,
              id: "date",
              type: "date",
              value: moment().format("YYYY-MM-DD"),
              label: "Дата *",
            },
          ],
        ],
      ],
    ];
  }, []);

  const buttons = useMemo(
    () => [
      {
        id: 1,
        text: "Принять",
        onClick: (data) => {
          data.amount = -data.amount;
          data.client_id = clientId;
          createDebt(setIsLoading, token, data, next);
        },
      },
    ],
    [next, clientId, setIsLoading, token]
  );

  return (
    <InputsLayout inputs={inputs} buttons={buttons} disabled={isLoading} />
  );
}

export default CreateDebtPaymentForm;

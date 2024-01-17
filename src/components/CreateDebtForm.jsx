import { useState, useCallback, useMemo } from "react";
import MyInput from "./MyInput";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import Switch from "./Switch";
import { createDebt } from "../api/ClientApi";
import DateTimePicker from "./DateTimePicker";
import MyTextarea from "./MyTextarea";
import moment from "moment";

function CreateDebtForm({ isLoading, setIsLoading, clientId, next }) {
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
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);
  const [comment, setComment] = useState("");
  const { token } = useAuth();

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

  const buttons = useMemo(
    () => [
      {
        id: 1,
        text: "Сохранить",
        type: "submit",
        loading: isLoading,
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          const data = {};
          inputs.forEach((item) => {
            data[item.name] = item.value;
          });
          if (ownDate) {
            data.date = moment(date).toDate();
          }
          if (comment) {
            data.comment = comment;
          }
          data.client_id = clientId;
          createDebt(setIsLoading, token, data, next);
        },
      },
    ],
    [
      isLoading,
      next,
      clientId,
      setIsLoading,
      token,
      comment,
      date,
      ownDate,
      inputs,
    ]
  );

  return (
    <FormLayout
      firstHalf={
        <div>
          {inputs.map((item) => (
            <MyInput
              onChange={(e) => {
                handleInputChange(item.id, e.target.value);
              }}
              label={item.title}
              key={item.id}
              value={item.value}
              disabled={isLoading}
              inputMode={item.inputMode}
              integer={item.integer}
              unsigned={item.unsigned}
              zerofill={item.zerofill}
            />
          ))}
          <MyTextarea
            placeholder=""
            label="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            max={150}
          />
          <Switch
            disabled={isLoading}
            label="Своя дата"
            isChecked={ownDate}
            setChecked={setOwnDate}
          />
          {ownDate && (
            <DateTimePicker
              disabled={isLoading}
              label="Дата"
              dateTime={date}
              setDateTime={setDate}
            />
          )}
        </div>
      }
      buttons={buttons}
    />
  );
}

export default CreateDebtForm;

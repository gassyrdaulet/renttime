import { useState, useCallback, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import Switch from "./Switch";
import { createDebt } from "../api/ClientApi";
import DatePicker from "./DatePicker";
import MyTextarea from "./MyTextarea";
import moment from "moment";
import Select from "./Select";

function CreateViolationForm({
  isLoading,
  setIsLoading,
  clientId,
  orderId,
  next,
}) {
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedSpecie, setSelectedSpecie] = useState("");
  const [type, setType] = useState();
  const { token } = useAuth();

  const violationTypes = useMemo(
    () => [
      { id: "missing", name: "Потеря" },
      { id: "broken", name: "Поломка" },
    ],
    []
  );

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
            data.date = date;
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
          <Select
            disabled={isLoading}
            loading={isLoading}
            options={violationTypes}
            setValue={setType}
            value={type}
            label="Тип нарушения"
          />
          {ownDate && (
            <DatePicker
              disabled={isLoading}
              label="Дата"
              selectedDate={date}
              handleDateChange={setDate}
              timeFormat="HH:mm"
            />
          )}
        </div>
      }
      buttons={buttons}
    />
  );
}

export default CreateViolationForm;

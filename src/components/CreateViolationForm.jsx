import { useState, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import Switch from "./Switch";
import DateTimePicker from "./DateTimePicker";
import MyTextarea from "./MyTextarea";
import moment from "moment";
import Select from "./Select";
import { newViolation } from "../api/OrderApi";

function CreateNewViolationForm({
  isLoading,
  setIsLoading,
  orderId,
  species,
  next,
}) {
  const [date, setDate] = useState(moment());
  const [ownDate, setOwnDate] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedSpecie, setSelectedSpecie] = useState("none");
  const [type, setType] = useState("missing");
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
          const data = {
            order_id: orderId,
            specie_id: selectedSpecie,
            specie_violation_type: type,
          };
          if (ownDate) {
            data.date = moment(date).toDate();
          }
          if (comment) {
            data.comment = comment;
          }
          newViolation(setIsLoading, token, data, next);
        },
      },
    ],
    [
      isLoading,
      next,
      setIsLoading,
      orderId,
      token,
      comment,
      date,
      ownDate,
      selectedSpecie,
      type,
    ]
  );

  const formattedSpecies = useMemo(
    () =>
      species.map((item) => ({
        id: item.specie.id,
        name: `${item.good.id}/${item.specie.id} - ${item.good.name}`,
      })),
    [species]
  );

  return (
    <FormLayout
      firstHalf={
        <div>
          <Select
            disabled={isLoading}
            loading={isLoading}
            defaultOptions={[{ id: "none", name: "Не выбрано" }]}
            options={formattedSpecies}
            setValue={setSelectedSpecie}
            value={selectedSpecie}
            label="Товар"
          />
          <Select
            disabled={isLoading}
            loading={isLoading}
            options={violationTypes}
            setValue={setType}
            value={type}
            label="Тип нарушения"
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
          <MyTextarea
            placeholder=""
            label="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
            max={150}
          />
        </div>
      }
      buttons={buttons}
    />
  );
}

export default CreateNewViolationForm;

import { useState, useCallback, useMemo } from "react";
import MyInput from "./MyInput";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import FormLayout from "./FormLayout";
import ConfirmModal from "./ConfirmModal";
import { deleteSpecie, editSpecie } from "../api/GoodsApi";

const { SPECIE_STATUSES } = config;

function EditSpecieForm({ isLoading, setIsLoading, specieInfo, next }) {
  const [inputs, setInputs] = useState([
    {
      id: 0,
      title: "Инвентарьный номер",
      value: String(specieInfo?.["code"]).padStart(10, "0"),
      name: "code",
      inputMode: "numeric",
      integer: true,
      unsigned: true,
      zerofill: 10,
    },
  ]);
  const { token } = useAuth();
  const [status, setStatus] = useState("available");
  const [deleteModal, setDeleteModal] = useState(false);

  const options = useMemo(() => {
    return Object.keys(SPECIE_STATUSES).map((key) => ({
      id: key,
      name: SPECIE_STATUSES[key],
    }));
  }, []);

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
        loading: String(isLoading),
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          const specieData = {};
          inputs.forEach((item) => {
            specieData[item.name] = item.value;
          });
          if (status !== "none") {
            specieData.status = status;
          }
          specieData.specie_id = specieInfo.id;
          editSpecie(setIsLoading, token, specieData, next);
        },
      },
      {
        id: 0,
        text: "Удалить",
        loading: String(isLoading),
        disabled: isLoading,
        onClick: (e) => {
          e.preventDefault();
          setDeleteModal(true);
        },
      },
    ],
    [next, isLoading, token, inputs, setIsLoading, status, specieInfo.id]
  );

  return (
    <FormLayout
      buttons={buttons}
      firstHalf={
        <div>
          <ConfirmModal
            visible={deleteModal}
            setVisible={setDeleteModal}
            loading={isLoading}
            title="Подтвердите действие"
            question={<p>Вы уверены что хотите удалить эту единицу?</p>}
            onConfirm={() =>
              deleteSpecie(setIsLoading, token, specieInfo.id, () => {
                setDeleteModal(false);
                next();
              })
            }
          />
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
          <Select
            label="Статус"
            value={status}
            setValue={setStatus}
            loading={isLoading}
            defaultOptions={[{ id: "no", name: "Не выбран" }]}
            options={options}
          />
        </div>
      }
    />
  );
}

export default EditSpecieForm;

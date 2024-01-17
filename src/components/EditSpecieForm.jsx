import { useState, useMemo } from "react";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import config from "../config/config.json";
import FormLayout from "./FormLayout";
import ConfirmModal from "./ConfirmModal";
import { deleteSpecie, editSpecie } from "../api/GoodsApi";

const { SPECIE_STATUSES } = config;

function EditSpecieForm({ isLoading, setIsLoading, specieInfo, next }) {
  const { token } = useAuth();
  const [status, setStatus] = useState("available");
  const [deleteModal, setDeleteModal] = useState(false);

  const options = useMemo(() => {
    return Object.keys(SPECIE_STATUSES).map((key) => ({
      id: key,
      name: SPECIE_STATUSES[key],
    }));
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
    [next, isLoading, token, setIsLoading, status, specieInfo.id]
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

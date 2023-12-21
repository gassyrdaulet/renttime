import { useState, useMemo, useEffect } from "react";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import { getCouriers } from "../api/OrganizationApi";
import FormLayout from "./FormLayout";
import { sendCourier } from "../api/DeliveriesApi";

function SendCourierForm({ isLoading, setIsLoading, deliveries = [], next }) {
  const { token } = useAuth();
  const [courierId, setCourierId] = useState(0);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    getCouriers(setIsLoading, token, setCouriers);
  }, [token, setIsLoading]);

  const courierOptions = useMemo(() => {
    const result = couriers.map((item) => ({
      id: item.userInfo?.id,
      name: `${item.userInfo?.name} (ID: ${item.userInfo?.id})`,
    }));
    return result;
  }, [couriers]);

  const buttons = useMemo(
    () => [
      {
        id: 1,
        text: "Отправить",
        type: "submit",
        loading: isLoading,
        disabled: isLoading || parseInt(courierId) === 0,
        onClick: (e) => {
          e.preventDefault();
          sendCourier(
            setIsLoading,
            token,
            deliveries,
            parseInt(courierId),
            next
          );
        },
      },
    ],
    [next, token, isLoading, setIsLoading, courierId, deliveries]
  );

  return (
    <FormLayout
      firstHalf={
        <div>
          <Select
            label="Выберите курьера"
            value={courierId}
            setValue={setCourierId}
            loading={isLoading}
            defaultOptions={[{ id: 0, name: "Не выбран" }]}
            options={courierOptions}
          />
        </div>
      }
      buttons={buttons}
    />
  );
}

export default SendCourierForm;

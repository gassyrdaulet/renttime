import { useState, useCallback, useMemo } from "react";
import MyInput from "./MyInput";
import MyTextarea from "./MyTextarea";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import FormLayout from "./FormLayout";
import { editDelivery } from "../api/DeliveriesApi";

function EditDeliveryForm({ deliveryInfo, isLoading, setIsLoading, next }) {
  const { token } = useAuth();
  const [direction, setDirection] = useState(deliveryInfo?.direction);
  const [delivery, setDelivery] = useState([
    { id: "address", value: deliveryInfo?.address, title: "Адрес доставки" },
    {
      id: "cellphone",
      value: deliveryInfo?.cellphone,
      title: "Номер телефона",
    },
    {
      id: "delivery_price_for_deliver",
      value: deliveryInfo?.delivery_price_for_deliver
        ? deliveryInfo?.delivery_price_for_deliver
        : "0",
      title: "Стоимость доставки для курьера",
      type: "price",
    },
    {
      id: "delivery_price_for_customer",
      value: deliveryInfo?.delivery_price_for_customer
        ? deliveryInfo?.delivery_price_for_customer
        : "0",
      title: "Стоимость доставки для клиента",
      type: "price",
    },
    {
      id: "comment",
      value: deliveryInfo?.comment,
      title: "Комментарий",
      type: "textarea",
    },
  ]);

  const deliveryOptions = useMemo(
    () => [
      {
        id: "here",
        name: "От клиента",
      },
      { id: "there", name: "К клиенту" },
    ],
    []
  );

  const handleChangeDelivery = useCallback((id, v) => {
    setDelivery((p) => {
      const temp = [...p];
      for (let item of temp) {
        if (item.id === id) {
          item.value = v;
          return temp;
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
          const data = {};
          delivery.forEach((item) => {
            data[item.id] = item.value;
          });
          if (!data.comment) {
            delete data.comment;
          }
          editDelivery(
            setIsLoading,
            token,
            { ...data, delivery_id: deliveryInfo.id },
            next
          );
        },
      },
    ],
    [next, isLoading, token, delivery, setIsLoading, deliveryInfo.id]
  );

  return (
    <FormLayout
      firstHalf={
        <div>
          <Select
            disabled={true}
            defaultOptions={[]}
            options={deliveryOptions}
            loading={isLoading}
            setValue={setDirection}
            value={direction}
            label="Направление"
          />
          {delivery.map((item) => {
            if (item.type) {
              if (item.type === "textarea") {
                return (
                  <MyTextarea
                    key={item.id}
                    label={item.title}
                    value={item.value ? item.value : ""}
                    disabled={isLoading}
                    onChange={(e) =>
                      handleChangeDelivery(item.id, e.target.value)
                    }
                  />
                );
              }
              if (item.type === "price") {
                return (
                  <MyInput
                    key={item.id}
                    label={item.title}
                    value={item.value ? item.value : ""}
                    integer={true}
                    unsigned={true}
                    disabled={isLoading}
                    onChange={(e) =>
                      handleChangeDelivery(item.id, e.target.value)
                    }
                  />
                );
              }
            }
            return (
              <MyInput
                key={item.id}
                label={item.title}
                value={item.value ? item.value : ""}
                disabled={isLoading}
                onChange={(e) => handleChangeDelivery(item.id, e.target.value)}
              />
            );
          })}
        </div>
      }
      buttons={buttons}
    />
  );
}

export default EditDeliveryForm;

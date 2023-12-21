import { useState, useCallback, useMemo, useEffect } from "react";
import MyInput from "./MyInput";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import { getMethods } from "../api/OrganizationApi";
import { newPaymentForCourier } from "../api/OrderApi";
import FormLayout from "./FormLayout";
import config from "../config/config.json";

const { DELIVERY_DIRECTIONS } = config;

function CreatePaymentCourierForm({
  createPaymentLoading,
  setCreatePaymentLoading,
  orderId,
  next,
  deliveries = [],
}) {
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
  const { token } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 0, name: "Загрузка..." },
  ]);
  const [paymentMethod, setPaymentMethod] = useState();
  const [deliveryId, setDeliveryId] = useState();

  useEffect(() => {
    getMethods(setCreatePaymentLoading, token, setPaymentMethods, true);
  }, [token, setCreatePaymentLoading]);

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

  const options = useMemo(() => {
    const result = paymentMethods.map((item) => ({
      id: item.id,
      name: item.name + (item.comission ? ` (${item.comission}%)` : ""),
    }));
    if (result.length !== 0) {
      setPaymentMethod(result[0].id);
    }
    return result;
  }, [paymentMethods]);

  const deliveryOptions = useMemo(() => {
    const result = deliveries.map((item) => ({
      id: item.id,
      name: `(${DELIVERY_DIRECTIONS[item.direction]}) ` + item.address,
    }));
    if (result.length !== 0) {
      setDeliveryId(result[0].id);
    }
    return result;
  }, [deliveries]);

  const buttons = useMemo(
    () => [
      {
        id: 1,
        text: "Сохранить",
        type: "submit",
        loading: createPaymentLoading,
        disabled: createPaymentLoading,
        onClick: (e) => {
          e.preventDefault();
          const data = {};
          inputs.forEach((item) => {
            data[item.name] = item.value;
          });
          newPaymentForCourier(
            setCreatePaymentLoading,
            token,
            orderId,
            {
              ...data,
              payment_method_id: paymentMethod,
              delivery_id: parseInt(deliveryId),
            },
            next
          );
        },
      },
    ],
    [
      deliveryId,
      createPaymentLoading,
      inputs,
      next,
      orderId,
      paymentMethod,
      setCreatePaymentLoading,
      token,
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
              disabled={createPaymentLoading}
              inputMode={item.inputMode}
              integer={item.integer}
              unsigned={item.unsigned}
              zerofill={item.zerofill}
            />
          ))}
          <Select
            label="Способ оплаты"
            value={paymentMethod}
            setValue={setPaymentMethod}
            loading={createPaymentLoading}
            defaultOptions={[]}
            options={options}
          />
          <Select
            label="Доставка"
            value={deliveryId}
            setValue={setDeliveryId}
            loading={createPaymentLoading}
            defaultOptions={[]}
            options={deliveryOptions}
          />
        </div>
      }
      buttons={buttons}
    ></FormLayout>
  );
}

export default CreatePaymentCourierForm;

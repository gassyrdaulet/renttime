import { useState, useCallback, useMemo, useEffect } from "react";
import MyInput from "./MyInput";
import Select from "./Select";
import useAuth from "../hooks/useAuth";
import { controlWorkshift, getMethods } from "../api/OrganizationApi";
import FormLayout from "./FormLayout";
import useConfirm from "../hooks/useConfirm";

function CreateOperationForm({ isLoading, setIsLoading, workshiftId, next }) {
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
  const { confirm } = useConfirm();

  useEffect(() => {
    getMethods(setIsLoading, token, setPaymentMethods);
  }, [token, setIsLoading]);

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
        type: "none",
        loading: isLoading,
        disabled: isLoading,
        text: "Снять",
        onClick: async (e) => {
          e.preventDefault();
          if (await confirm("Вы уверены что хотите снять деньги со смены?")) {
            const data = {};
            inputs.forEach((item) => {
              data[item.name] = item.value;
            });
            data.workshift_id = workshiftId;
            data.positive = false;
            data.payment_method_id = paymentMethod;
            controlWorkshift(setIsLoading, data, token, next);
          }
        },
      },
      {
        id: 2,
        type: "none",
        loading: isLoading,
        disabled: isLoading,
        text: "Добавить",
        onClick: async (e) => {
          e.preventDefault();
          if (await confirm("Вы уверены что хотите добавить деньги в смену?")) {
            const data = {};
            inputs.forEach((item) => {
              data[item.name] = item.value;
            });
            data.workshift_id = workshiftId;
            data.positive = true;
            data.payment_method_id = paymentMethod;
            controlWorkshift(setIsLoading, data, token, next);
          }
        },
      },
    ],
    [
      confirm,
      inputs,
      isLoading,
      next,
      paymentMethod,
      setIsLoading,
      token,
      workshiftId,
    ]
  );

  return (
    <FormLayout
      buttons={buttons}
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
          <Select
            label="Способ оплаты"
            value={paymentMethod}
            setValue={setPaymentMethod}
            loading={isLoading}
            defaultOptions={[]}
            options={options}
          />
        </div>
      }
    />
  );
}

export default CreateOperationForm;

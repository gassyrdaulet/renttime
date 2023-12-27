import { useState, useCallback, useMemo } from "react";
import MyButton from "./MyButton";
import MyInput from "./MyInput";
import MyTextarea from "./MyTextarea";
import styled from "styled-components";
import Select from "./Select";
import { newDelivery } from "../api/DeliveriesApi";
import useAuth from "../hooks/useAuth";

const CreateDeliverytFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 800px;
  height: 70vh;
  max-height: 70vh;
`;
const CreateDeliveryFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
`;
const CreateDeliveryInputContainers = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const DeliveryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  width: 100%;
  @media (max-width: 800px) {
    max-width: 300px;
  }
`;
const DeliveryButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 10px 0px 10px;
  border-top: 1px solid #c3c3c3;
`;

function CreateNewDelivery({
  cellphone,
  address,
  createDeliveryLoading,
  setCreateDeliveryLoading,
  orderId,
  next,
}) {
  const { token } = useAuth();
  const [direction, setDirection] = useState("there");
  const [delivery, setDelivery] = useState([
    { id: "address", value: address, title: "Адрес доставки" },
    { id: "cellphone", value: cellphone, title: "Номер телефона" },
    {
      id: "delivery_price_for_deliver",
      value: "0",
      title: "Стоимость доставки для курьера",
      type: "price",
    },
    {
      id: "delivery_price_for_customer",
      value: "0",
      title: "Стоимость доставки для клиента",
      type: "price",
    },
    { id: "comment", value: "", title: "Комментарий", type: "textarea" },
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

  return (
    <CreateDeliverytFormWrapper>
      <CreateDeliveryFormContainer>
        <CreateDeliveryInputContainers>
          <DeliveryWrapper>
            <Select
              defaultOptions={[]}
              options={deliveryOptions}
              loading={createDeliveryLoading}
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
                      value={item.value}
                      disabled={createDeliveryLoading}
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
                      value={item.value}
                      integer={true}
                      unsigned={true}
                      disabled={createDeliveryLoading}
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
                  value={item.value}
                  disabled={createDeliveryLoading}
                  onChange={(e) =>
                    handleChangeDelivery(item.id, e.target.value)
                  }
                />
              );
            })}
          </DeliveryWrapper>
        </CreateDeliveryInputContainers>
      </CreateDeliveryFormContainer>
      <DeliveryButtonWrapper style={{ delete: true }}>
        <MyButton
          type="submit"
          loading={String(createDeliveryLoading)}
          disabled={createDeliveryLoading}
          margin="0"
          text="Сохранить"
          onClick={(e) => {
            e.preventDefault();
            const data = {};
            delivery.forEach((item) => {
              data[item.id] = item.value;
            });
            if (!data.comment) {
              delete data.comment;
            }
            newDelivery(
              setCreateDeliveryLoading,
              token,
              orderId,
              { direction, ...data },
              next
            );
          }}
        />
      </DeliveryButtonWrapper>
    </CreateDeliverytFormWrapper>
  );
}

export default CreateNewDelivery;
